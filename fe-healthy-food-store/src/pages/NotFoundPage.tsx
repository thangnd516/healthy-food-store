import { Button } from "antd";
import NotFoundImage from "../assets/404-image.jpg";
import "../styles/stylesNotFoundPage.scss";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="not-found">
      <img srcSet={`${NotFoundImage} 2x`} alt="" />
      <Button type="primary" onClick={() => navigate("/")}>
        Back To Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
