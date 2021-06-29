import { Card } from "antd";
import Image from "next/image";
const { Meta } = Card;

const NewBookCard = () => {
  return (
    <Card hoverable style={{ width: '50px' }} cover={<Image alt="example" width="50px" height='240px' src={'/image/3.png'} />}>
      <Meta title="구술면접 380제" description={
        <div>가격 : 55,000원</div>
      } />
    </Card>
  );
};

export default NewBookCard;
