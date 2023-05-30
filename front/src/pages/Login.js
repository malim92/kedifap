import { useState, useEffect } from "react";
import { Pagination, Scrollbar, A11y, Autoplay } from "swiper";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Swiper, SwiperSlide } from "swiper/react";
import LoginForm from "./LoginForm";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/scrollbar";
import slider1 from "../assets/1.jpg";
import slider2 from "../assets/2.jpg";
import slider3 from "../assets/3.jpg";
import logo from "../assets/kedi logo.png";
import leafe from "../assets/leafe.png";
import "./login.css";

export default ({ setIsAuthenticated }) => {
  const [swiperHeight, setSwiperHeight] = useState(0);

  useEffect(() => {
    function handleResize() {
      setSwiperHeight(window.innerHeight); // subtracting any additional padding/margin
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
        <Container fluid>
          <Row>
            <Col style={{ paddingLeft: 0, paddingRight: 0 }} sm={6}>
              <Swiper
                // className="shadowed"
                modules={[Scrollbar, A11y, Autoplay]}
                autoplay={true}
                style={{ height: `${swiperHeight}px` }}
                scrollbar={{ draggable: true }}
              >
                <SwiperSlide>
                  <img
                    className="w-full img-slider"
                    src={slider1}
                    style={{
                      objectFit: "cover",
                      width: "960px",
                      height: `${swiperHeight}px`,
                    }}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    className="w-full img-slider"
                    src={slider2}
                    style={{
                      objectFit: "cover",
                      width: "960px",
                      height: `${swiperHeight}px`,
                    }}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    className="w-full img-slider"
                    src={slider3}
                    style={{
                      objectFit: "cover",
                      width: "960px",
                      height: `${swiperHeight}px`,
                    }}
                  />
                </SwiperSlide>
                ...
              </Swiper>
            </Col>
            <Col sm={6}>
              <div className="container" style={{ padding: "20px" }}>
              <div class="top-bar d-flex justify-content-end">
        <a href="/contact">Contact us</a>
          </div>
                <img className="logo-login-top" src={logo} alt="" />
                <div className="form-header">
                  <h3>Καλώς ήρθατε στο Web Portal της ΚΕΔΙΦΑΠ</h3>
                  <img className="form-img" src={leafe} alt="placeholder" />
                </div>

                <LoginForm setIsAuthenticated={setIsAuthenticated} />
              </div>
            </Col>
          </Row>
        </Container>
    </>
  );
};
