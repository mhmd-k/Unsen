import { Carousel, Col, Container, Row, Figure } from "react-bootstrap";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import Button from "react-bootstrap/Button";
import imageone from "../assets/images/catigories/cate1.png";
import imageTwo from "../assets/images/catigories/cate2.png";
import imageThree from "../assets/images/catigories/cate3.png";
import imageFour from "../assets/images/catigories/cate4.png";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("shop");
  }

  return (
    <>
      <div className="landing">
        <Carousel keyboard={false} controls={false}>
          <Carousel.Item>
            <Carousel.Caption>
              <h2 className="text-dark">Color your look</h2>
              <p>Featured Apple Accessories</p>
              <Button className="landing-btn" onClick={handleClick}>
                SHOP NOW <BsFillArrowRightCircleFill />
              </Button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <Carousel.Caption>
              <h2 className="text-dark">New arrivals</h2>
              <p>Sale up to 30% today</p>
              <Button className="landing-btn" onClick={handleClick}>
                SHOP NOW <BsFillArrowRightCircleFill />
              </Button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <Carousel.Caption>
              <h2 className="text-dark">Accessories</h2>
              <p>New arrivals collection</p>
              <Button className="landing-btn" onClick={handleClick}>
                SHOP NOW <BsFillArrowRightCircleFill />
              </Button>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
      <div className="categories pb-5">
        <h3 className="fs-2 text-center py-5">Top Categories</h3>
        <Container>
          <Row>
            <Col>
              <Link to="shop?collection=headphones">
                <Figure>
                  <Figure.Image width={300} alt="171x180" src={imageone} />
                  <Figure.Caption className="text-center fs-5">
                    Headphones
                  </Figure.Caption>
                </Figure>
              </Link>
            </Col>
            <Col>
              <Link to="shop?collection=phone-cases">
                <Figure>
                  <Figure.Image width={300} alt="171x180" src={imageTwo} />
                  <Figure.Caption className="text-center fs-5">
                    Phone cases
                  </Figure.Caption>
                </Figure>
              </Link>
            </Col>
            <Col>
              <Link to="shop?collection=controllers">
                <Figure>
                  <Figure.Image width={300} alt="171x180" src={imageThree} />
                  <Figure.Caption className="text-center fs-5">
                    Game Controllers
                  </Figure.Caption>
                </Figure>
              </Link>
            </Col>
            <Col>
              <Link to="shop?collection=speakers">
                <Figure>
                  <Figure.Image width={300} alt="171x180" src={imageFour} />
                  <Figure.Caption className="text-center fs-5">
                    Speakers
                  </Figure.Caption>
                </Figure>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Home;
