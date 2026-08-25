import { Modal } from "antd";
import { IIngredient } from "../../../types/typeIngredient";
import { IMeal } from "../../../types/typeMeal";

interface IProps {
  isShowNature: boolean;
  setIsShowNature(isShowNature: boolean): void;
  ingredient?: IIngredient | null;
  meal?: IMeal | null;
  kind: string;
}
const ModalNutire = (props: IProps) => {
  const { isShowNature, setIsShowNature, ingredient, meal, kind } = props;
  const handleOk = () => {
    setIsShowNature(false);
  };

  const handleCancel = () => {
    setIsShowNature(false);
  };

  return (
    <>
      <Modal
        title="Thông tin dinh dưỡng"
        open={isShowNature}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        <div className="p-3 bg-white rounded-md shadow-xl">
          <div className="h-full p-2">
            <div className="mt-2 text-sm border border-gray-500 rounded-md">
              <div className="flex items-center justify-between bg-[#f2f2f2] p-2 rounded-md">
                <span>Serving size</span>
                <span>{`${
                  kind === "ingredient"
                    ? ingredient?.weight
                    : kind === "meal"
                    ? meal?.weight
                    : ""
                } g`}</span>
              </div>
              <div className="flex items-center justify-between p-2">
                <span>Calories</span>
                <span>{`${
                  kind === "ingredient"
                    ? ingredient?.calo
                    : kind === "meal"
                    ? meal?.calo
                    : ""
                } Kcal`}</span>
              </div>
              <div className="flex items-center justify-between bg-[#f2f2f2] p-2 rounded-md">
                <span>Protein</span>
                <span>{`${
                  kind === "ingredient"
                    ? ingredient?.protein
                    : kind === "meal"
                    ? meal?.protein
                    : ""
                } g`}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md">
                <span>Cholesterol</span>
                <span>{`${
                  kind === "ingredient"
                    ? ingredient?.cholesterol
                    : kind === "meal"
                    ? meal?.cholesterol
                    : ""
                } mg`}</span>
              </div>
              <div className="flex items-center bg-[#f2f2f2] justify-between p-2 rounded-md">
                <span>Sodium</span>
                <span>{`${
                  kind === "ingredient"
                    ? ingredient?.sodium
                    : kind === "meal"
                    ? meal?.sodium
                    : ""
                } mg`}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md">
                <span>Calcium</span>
                <span>{`${
                  kind === "ingredient"
                    ? ingredient?.calcium
                    : kind === "meal"
                    ? meal?.calcium
                    : ""
                } mg`}</span>
              </div>
              <div className="flex items-center bg-[#f2f2f2] justify-between p-2 rounded-md">
                <span>Iron</span>
                <span>{`${
                  kind === "ingredient"
                    ? ingredient?.iron
                    : kind === "meal"
                    ? meal?.iron
                    : ""
                } mg`}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md">
                <span>Zinc</span>
                <span>{`${
                  kind === "ingredient"
                    ? ingredient?.zinc
                    : kind === "meal"
                    ? meal?.zinc
                    : ""
                } mg`}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-[#f2f2f2]">
                <span>Total Carb</span>
                <span>{`${
                  kind === "ingredient"
                    ? ingredient?.carb
                    : kind === "meal"
                    ? meal?.carb
                    : ""
                } g`}</span>
              </div>
              <div className="flex flex-col pl-8 pr-2 gap-y-1 bg-[#f2f2f2] rounded-md">
                <div className="flex items-center justify-between">
                  <span>Dietary Fiber</span>
                  <span>{`${
                    kind === "ingredient"
                      ? ingredient?.fiber
                      : kind === "meal"
                      ? meal?.fiber
                      : ""
                  } g`}</span>
                </div>
                <div className="flex items-center justify-between rounded-md">
                  <span>Total Sugar</span>
                  <span>{`${
                    kind === "ingredient"
                      ? ingredient?.sugar
                      : kind === "meal"
                      ? meal?.sugar
                      : ""
                  } g`}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md">
                <span>Total Fat</span>
                <span>{`${
                  kind === "ingredient"
                    ? ingredient?.fat
                    : kind === "meal"
                    ? meal?.fat
                    : ""
                } g`}</span>
              </div>
              <div className="flex flex-col pl-8 pr-2 gap-y-1">
                <div className="flex items-center justify-between">
                  <span>Saturated Fat</span>
                  <span>{`${
                    kind === "ingredient"
                      ? ingredient?.satFat
                      : kind === "meal"
                      ? meal?.satFat
                      : ""
                  } g`}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Trans Fat</span>
                  <span>{`${
                    kind === "ingredient"
                      ? ingredient?.transFat
                      : kind === "meal"
                      ? meal?.transFat
                      : ""
                  } g`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalNutire;
