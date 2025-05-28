import { Carousel, Col, Container, Row, Figure, Stack } from "react-bootstrap";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import imageone from "../assets/images/catigories/cate1.png";
import imageTwo from "../assets/images/catigories/cate2.png";
import imageThree from "../assets/images/catigories/cate3.png";
import imageFour from "../assets/images/catigories/cate4.png";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const carouselItems = [
  {
    title: "Color your look",
    subtitle: "Featured Apple Accessories",
  },
  {
    title: "New arrivals",
    subtitle: "Sale up to 30% today",
  },
  {
    title: "Accessories",
    subtitle: "New arrivals collection",
  },
];

function Home() {
  const { user } = useAuth();

  return (
    <>
      <div className="landing">
        <Carousel keyboard={false} controls={false}>
          {carouselItems.map((item, index) => (
            <Carousel.Item key={index}>
              <Carousel.Caption>
                <h2 className="text-dark">{item.title}</h2>
                <p>{item.subtitle}</p>
                <Stack gap={2}>
                  <Link className="landing-btn" to="/shop">
                    SHOP NOW <BsFillArrowRightCircleFill />
                  </Link>
                  {!user && (
                    <Link className="landing-btn" to="/signup">
                      Create Account <BsFillArrowRightCircleFill />
                    </Link>
                  )}
                </Stack>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
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
