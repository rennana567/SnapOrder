import { Swiper } from 'react-vant';

export const SwiperDemo = () => {
    const imgArr = [
    '/ruixingcoffee.png',
    '/machamburger.png',
    '/startbuckcoffee.png'
  ];
    const items = imgArr.map((i) => (
    <Swiper.Item key={i}>
      <img src={i} alt="" />
    </Swiper.Item>
  ));
  return (
    <div className="demo-swiper">
      <Swiper autoplay={3000} slideSize={80} trackOffset={10}>
        {items}
      </Swiper>
    </div>
  );
};

export default SwiperDemo;