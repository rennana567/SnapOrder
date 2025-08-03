import {
  Outlet,
  useNavigate,
  useLocation
} from "react-router-dom"
import {
  useEffect,
  useState
} from 'react'
import {
 Tabbar
} from 'react-vant'
import {
  HomeO,
  WapHome,
  SmileO,
  Smile,
  ManagerO,
  Manager,
  CartO,
  Cart
} from '@react-vant/icons'

const MainLayout = ()=>{
  const tabs = [
    {icon:<HomeO/>,title:'首页',path:'/home'},
    {icon:<CartO/>,title:'购物车',path:'/order'},
    {icon:<SmileO/>,title:'顾问',path:'/consultant'},
    {icon:<ManagerO/>,title:'我的',path:'/account'},
  ];
  const [active,setActive] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(()=>{
   const index = tabs.findIndex(tab=>location.pathname.startsWith(tab.path))
   setActive(index>=0?index:0)
  },[location.pathname])

  return (
    <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-hidden">
          <Outlet/>
        </div>
        
        {/* tabbar */}
        <Tabbar
          value={active}
          onChange={
            (key)=>{
              const index = typeof key === 'string' ? parseInt(key, 10) : key;
              setActive(index)
              navigate(tabs[index].path, { replace: true })
            }
          }
          placeholder={true} /* 这个属性会自动为标签栏留出空间 */
        >
          {
            tabs.map((tab,index)=>{
              // 根据激活状态选择图标
              let displayIcon;
              if (active === index) {
                // 激活状态使用填充图标
                switch(index) {
                  case 0: displayIcon = <WapHome/>; break;
                  case 1: displayIcon = <Cart/>; break;
                  case 2: displayIcon = <Smile/>; break;
                  case 3: displayIcon = <Manager/>; break;
                  default: displayIcon = tab.icon;
                }
              } else {
                // 非激活状态使用轮廓图标
                displayIcon = tab.icon;
              }

              return (
                <Tabbar.Item
                  key={index}
                  icon={displayIcon}
                >
                  {tab.title}
                </Tabbar.Item>
              )
            })
          }
        </Tabbar>
    </div>
  )
}

export default MainLayout