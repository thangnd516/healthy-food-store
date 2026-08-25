import { Select, Space } from "antd";
import { getAllIngredient } from "../../services/ingredient";
import { IIngredient } from "../../types/typeIngredient";
import { useEffect, useState } from "react";

interface IProps {
  selectedIngredient: any;
  setSelectedIngredient: any;
}
const Dropdown = (props: IProps) => {
  const { setSelectedIngredient, selectedIngredient } = props;
  const [listIngredients, setListIngredients] = useState<IIngredient[]>([]);
  const fetchListIngredients = async () => {
    const response: any = await getAllIngredient(1, 9999);
    if (response?.statusCode === 200) {
      setListIngredients(response?.ingredientData);
    }
  };
  useEffect(() => {
    fetchListIngredients();
  }, []);
  const handleChange = (value: string[]) => {
    setSelectedIngredient(value);
  };
  const ingredientOptions = listIngredients?.map((item: IIngredient) => {
    return { value: item?._id, label: item?.name };
  });
  return (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder="Select ingredients"
      value={selectedIngredient}
      onChange={handleChange}
      options={ingredientOptions}
      optionRender={(option) => (
        <Space>
          <span role="img" aria-label={option.data.label}>
            {option?.label}
          </span>
        </Space>
      )}
    />
  );
};

export default Dropdown;
