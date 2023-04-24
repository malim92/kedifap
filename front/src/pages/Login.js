import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Swiper, SwiperSlide } from "swiper/react";
import LoginForm from "./LoginForm";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Slide from "../assets/slide1.jpg";
import logo from "../assets/kedi logo.png";
import leafe from "../assets/leafe.png";
import "./login.css";

export default () => {
  const handleLoginFormSubmit = (credentials) => {
    console.log(
      `Username: ${credentials.username}, Password: ${credentials.password}`
    );
  };

  return (
    <>
      <div className="container" style={{ padding: "50px" }}>
        <Container>
          <Row>
            <Col sm={6}>
              <Swiper
                // className="shadowed"
                modules={[Navigation, Scrollbar, A11y]}
                navigation={true}
                style={{ height: "500px" }}
                scrollbar={{ draggable: true }}
              >
                <SwiperSlide>
                  <img
                    className="w-full img-slider"
                    src={Slide}
                    style={{
                      objectFit: "cover",
                      width: "400px",
                      height: "500px",
                    }}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    className="w-full img-slider"
                    src={Slide}
                    style={{
                      objectFit: "cover",
                      width: "400px",
                      height: "500px",
                    }}
                  />
                </SwiperSlide>
                ...
              </Swiper>
            </Col>
            <Col sm={6}>
              <div className="container">
                <img className="logo-login-top" src={logo} alt="" />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h3>Καλώς ήρθατε στο Web Portal της ΚΕΔΙΦΑΠ</h3>
                  <img
                    src={leafe}
                    alt="placeholder"
                    style={{ marginRight: "10px", width: "4em" }}
                  />
                </div>

                <LoginForm onSubmit={handleLoginFormSubmit} />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
