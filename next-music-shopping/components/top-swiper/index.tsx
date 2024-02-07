import { ReactElement, memo, useRef, useState } from "react";
import type { ElementRef, FC } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";
import { Carousel } from "antd";
import { Ibanner } from "@/service/home";
import Image from "next/image";

interface IProps {
  children?: ReactElement;
  banners?: Ibanner[];
}
const TopSwiper: FC<IProps> = memo(function (props) {
  const { children, banners } = props;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const bannerRef = useRef<ElementRef<typeof Carousel>>(null);

  const onChange = (currentSlide: number) => {
    setCurrentIndex(currentSlide);
  };

  const handlePrevPage = () => {
    bannerRef.current?.prev();
  };
  const handleNextPage = () => {
    bannerRef.current?.next();
  };
  return (
    <div className={styles["top-swiper"]}>
      <div className={classNames("wrapper", styles.content)}>
        <Carousel
          ref={bannerRef}
          className={styles.carousel}
          afterChange={onChange}
          autoplay
          autoplaySpeed={3000}
          fade
          dots={false}
        >
          {banners?.map((banner) => {
            return (
              <div className={styles["swiper-item"]} key={banner.id}>
                <div
                  className={styles["swiper-bg"]}
                  style={{
                    backgroundImage: `url(${banner.backendPicStr})`,
                  }}
                ></div>
                <Image
                  priority
                  className={styles.image}
                  src={banner.picStr!}
                  alt="banner"
                  width={1100}
                  height={480}
                ></Image>
              </div>
            );
          })}
        </Carousel>

        {/* 指示器 */}
        <ul className={styles.dots}>
          {banners?.map((banner, index) => {
            return (
              <li
                key={banner.id}
                className={classNames(
                  styles.dot,
                  currentIndex === index ? styles.active : ""
                )}
              ></li>
            );
          })}
        </ul>
      </div>

      <button className={styles.prev} onClick={handlePrevPage}>
        <span></span>
      </button>
      <button className={styles.next} onClick={handleNextPage}>
        <span></span>
      </button>
    </div>
  );
});

export default TopSwiper;
TopSwiper.displayName = "TopSwiper";
