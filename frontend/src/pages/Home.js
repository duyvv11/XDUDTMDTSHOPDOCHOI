import Slider from "react-slick";
import "./Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";

function Home() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/new") 
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(err => console.log(err));
  }, []);

  const bannerData = news.map(it=>{
    return {
      id:it._id,
      title:it.title,
      imageUrl:it.imagenew
    }
  })

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <div className="home-wrapper">

      {/* Slider Banner */}
      <div className="main-banner-carousel">
        <Slider {...sliderSettings}>
          {bannerData.map((banner) => (
            <div key={banner.id} className="banner-slide-item">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="banner-image"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* NEWS SECTION */}
      <h2 className="news-title">Tin Tức </h2>

      <div className="news-list">
        {news.map(item => (
          <div key={item._id} className="news-item">
            <img
              src={item.imagenew}
              alt={item.title}
              className="news-image"
            />

            <div className="news-content">
              <h3>{item.title}</h3>
              <p>{item.content}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Home;
