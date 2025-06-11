import { BsFillArrowRightCircleFill } from "react-icons/bs";
import imageone from "../assets/images/catigories/cate1.png";
import imageTwo from "../assets/images/catigories/cate2.png";
import imageThree from "../assets/images/catigories/cate3.png";
import imageFour from "../assets/images/catigories/cate4.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import CarousalImageOne from "../assets/images/landing/Electronic-1.png";
import CarousalImageTwo from "../assets/images/landing/Electronic-2.png";
import CarousalImageThree from "../assets/images/landing/Electronic-3.png";
import { Card } from "@/components/ui/card";

const carouselItems = [
  {
    title: "Color your look",
    subtitle: "Featured Apple Accessories",
    image: CarousalImageOne,
  },
  {
    title: "New arrivals",
    subtitle: "Sale up to 30% today",
    image: CarousalImageTwo,
  },
  {
    title: "Accessories",
    subtitle: "New arrivals collection",
    image: CarousalImageThree,
  },
];

function Home() {
  const { user } = useAuth();

  const navigate = useNavigate();

  return (
    <>
      <Carousel
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index}>
              <div
                style={{
                  backgroundImage: `url(${item.image})`,
                }}
                className="bg-cover bg-center h-[75dvh]"
              >
                <div className="flex flex-col justify-center text-center h-full ps-4">
                  <h2 className="mb-2 text-left text-5xl font-light">
                    {item.title}
                  </h2>
                  <p className="text-2xl text-muted-foreground mb-6 text-left">
                    {item.subtitle}
                  </p>
                  <div className="flex flex-col gap-4">
                    <Button
                      onClick={() => navigate("/shop")}
                      size="lg"
                      className="landing-btn"
                    >
                      SHOP NOW <BsFillArrowRightCircleFill />
                    </Button>
                    {!user && (
                      <Button
                        onClick={() => navigate("/signup")}
                        size="lg"
                        className="landing-btn"
                      >
                        Create Account <BsFillArrowRightCircleFill />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="py-12">
        <h2 className="text-4xl text-center mb-12">Top Categories</h2>
        <div className="container px-2 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white p-0">
              <Link to="shop?collection=headphones" className="group">
                <div>
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={imageone}
                      alt="Headphones"
                      className="w-full h-auto transition-transform group-hover:scale-105"
                    />
                  </div>
                  <p className="text-lg text-center pb-4">Headphones</p>
                </div>
              </Link>
            </Card>{" "}
            <Card className="bg-white p-0">
              <Link to="shop?collection=phone-cases" className="group">
                <div>
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={imageTwo}
                      alt="Phone cases"
                      className="w-full h-auto transition-transform group-hover:scale-105"
                    />
                  </div>
                  <p className="text-lg text-center pb-4">Phone cases</p>
                </div>
              </Link>{" "}
            </Card>{" "}
            <Card className="bg-white p-0">
              <Link to="shop?collection=controllers" className="group">
                <div>
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={imageThree}
                      alt="Game Controllers"
                      className="w-full h-auto transition-transform group-hover:scale-105"
                    />
                  </div>
                  <p className="text-lg text-center pb-4">Game Controllers</p>
                </div>
              </Link>
            </Card>
            <Card className="bg-white p-0">
              <Link to="shop?collection=speakers" className="group">
                <div>
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={imageFour}
                      alt="Speakers"
                      className="w-full h-auto transition-transform group-hover:scale-105"
                    />
                  </div>
                  <p className="text-lg text-center pb-4">Speakers</p>
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
