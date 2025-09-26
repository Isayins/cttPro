import MainLayout from "../layouts/MainLayout";
import { Carousel } from 'antd';
const contentStyle: React.CSSProperties = {
    height: '360px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };
const images = [
    {imageName:1},
    {imageName:2},
    {imageName:3},
]


export default function Home() {
  return (
    <MainLayout>
      <h2 className="text-2xl">首页内容</h2>
        <Carousel  autoplay={{ dotDuration: true }} autoplaySpeed={5000}  arrows infinite={true}>
            {images.map((image)=>{
                 return(
                    <div key = {image.imageName}>
                       <h3 style={contentStyle}>
                        {image.imageName}
                        </h3>  
                    </div>  
                )
            })}
        </Carousel>   
    </MainLayout>
  );
}




