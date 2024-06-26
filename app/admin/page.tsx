"use client";

import React, { useEffect, useState } from "react";

import {
  Button,
  Select,
  SelectItem,
  SelectSection,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { PlusIcon } from "@/public/icons/PlusIcon";
import {
  useGetCargoQuery,
  useGetCarsQuery,
  useGetPointsQuery,
  useDeleteCargoMutation,
} from "@/services/cargo.service";
import { FormatDateToRussian, TYPES_CARS } from "@/utils/helpers/general";
import { Switch } from "@/components/SwitchPlace";
import Table from "@/components/Table";
import { DeleteIcon } from "@/public/icons/DeleteIcon";
import { EyeIcon } from "@/public/icons/EyeIcon";
import { EditIcon } from "@/public/icons/EditIcon";
import { CreateModal } from "./CreateModal";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminPage() {
  const { onOpenChange, isOpen, onClose } = useDisclosure();

  const { push } = useRouter();

  const [page, setPage] = useState<number>(1);
  const [cargoId, setCargoId] = useState(0);
  const [type, setType] = useState("post");

  const [cargoData, setCargoData] = useState({
    startDate: "",
    endDate: "",
    carId: [],
    ByFrom: 0,
    ByTo: 0,
    productName: "",
    BySize: "",
    ByWeight: "",
    ByComment: "",
    fromMap: {
      lattitude: "",
      longitude: "",
    },
    toMap: {
      lattitude: "",
      longitude: "",
    },
  });
  const [filter, setFilter] = useState<any>({
    ByFrom: "",
    ByTo: "",
  });
  const [carId, setCarId] = useState<any>([]);
  const [array, setArray] = useState<any>([]);

  const { data = { content: [], totalPages: 0 }, isLoading } = useGetCargoQuery(
    {
      page: page,
      size: 7,
      carId: carId.map((item: any) => item.value),
      params: {
        ByFrom: filter.ByFrom.value,
        ByTo: filter.ByTo.value,
      },
    }
  );

  const { data: Points = [] } = useGetPointsQuery();
  const { data: Cars = [] } = useGetCarsQuery();

  useEffect(() => {
    if (typeof Cars === "object" && Cars !== null) {
      setArray([...(Cars.popularCar || []), ...(Cars.allCar || [])]);
    }
  }, [Cars]);

  const [deleteCargo] = useDeleteCargoMutation();

  const handleDelete = async (cargoId: any) => {
    try {
      const response = await deleteCargo(cargoId);
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Произошла ошибка!");
    }
  };

  const changeValue = (value: any, name: string) => {
    setFilter((prevFilter: any) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: any) => {
    let ids = [...carId];
    if (ids.includes(value)) {
      ids = ids.filter((id: number) => id !== value);
    } else {
      ids.push(value);
    }
    setCarId(ids);
  };

  const handleNavigate = (id: any) => {
    Cookies.set("user_token", "AUTHORIZED");
    push(`/cargo/${id}`);
  };

  const handlePut = (data: any) => {
    setType("put");
    setCargoId(data.cargoId);
    setCargoData({
      startDate: data.startDate,
      endDate: data.endDate,
      carId: data.carId,
      ByFrom: data.ByFrom.value,
      ByTo: data.ByTo.value,
      productName: data.productName,
      BySize: data.BySize,
      ByWeight: data.ByWeight,
      ByComment: data.ByComment,
      fromMap: {
        lattitude: data.fromMap.lattitude,
        longitude: data.fromMap.longitude,
      },
      toMap: {
        lattitude: data.toMap.lattitude,
        longitude: data.toMap.longitude,
      },
    });
    onOpenChange();
  };

  const COLUMNS_CUSTOMER = [
    {
      label: "Откуда Куда",
      action: (data: any) => {
        const ByFrom = data?.ByFrom?.label;
        const ByTo = data?.ByTo?.label;
        return (
          <div className="text-xs">
            {ByFrom} - {ByTo}
          </div>
        );
      },
    },
    {
      label: "Вес,т / объём,м³",
      action: (data: any) => {
        const ByWeight = data?.ByWeight;
        const BySize = data?.BySize;
        return (
          <div className="text-xs">
            {ByWeight},т / {BySize},м³
          </div>
        );
      },
    },
    {
      label: "Дата, От / До",
      action: (data: any) => {
        const startPeriod = data?.startDate;
        const endPeriod = data?.endDate;
        return (
          <div className="text-xs flex flex-col items-center">
            <span>{FormatDateToRussian(startPeriod)}</span>
            <span>-</span>
            <span>{FormatDateToRussian(endPeriod)}</span>
          </div>
        );
      },
    },
    {
      label: "Тип кузова",
      action: (data: any) => {
        return (
          <Tooltip
            className="w-[150px]"
            content={
              <div className="flex max-w-4/5 xs:max-w-full flex-wrap cursor-pointer">
                {array
                  ?.filter((car: any) => data?.carId.includes(car.value))
                  .map((item: any, index: number) => (
                    <span
                      key={index}
                      className="text-black mr-1 text-sm line-clamp-4"
                    >
                      {item.label},
                    </span>
                  ))}
              </div>
            }
          >
            <div className="flex max-w-4/5 xs:max-w-full flex-wrap cursor-pointer">
              {array
                ?.filter((car: any) => data?.carId.includes(car.value))
                .map((item: any, index: number) => (
                  <span
                    key={index}
                    className="text-white mr-1 text-sm line-clamp-4"
                  >
                    {item.label},
                  </span>
                ))}
            </div>
          </Tooltip>
        );
      },
    },
    {
      label: "Комментарий",
      action: (data: any) => {
        const ByComment = data?.ByComment;
        return (
          <Tooltip className="w-[150px]" content={ByComment}>
            <div className="text-xs max-w-[150px] truncate cursor-pointer">
              {ByComment}
            </div>
          </Tooltip>
        );
      },
    },
    {
      label: "Действия",
      action: (data: any) => {
        return (
          <div className="flex gap-1">
            <Tooltip content="Подробнее">
              <Button
                onClick={() => handleNavigate(data.cargoId)}
                size="sm"
                isIconOnly
                color="warning"
                aria-label="Like"
              >
                <EyeIcon width={15} height={15} />
              </Button>
            </Tooltip>
            <Tooltip content="Удалить">
              <Button
                onClick={() => handleDelete(data.cargoId)}
                size="sm"
                isIconOnly
                color="danger"
                aria-label="Like"
              >
                <DeleteIcon width={15} height={15} />
              </Button>
            </Tooltip>
            <Tooltip content="Редактировать">
              <Button
                onClick={() => handlePut(data)}
                size="sm"
                isIconOnly
                color="success"
                aria-label="Like"
              >
                <EditIcon width={15} height={15} />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const handleClose = () => {
    setFilter({
      ByFrom: "",
      ByTo: "",
    });
    setCarId([]);
    setArray([]);
  };

  return (
    <>
      <div className="m-auto w-[90%] h-[100vh] mt-10 mb-[200px]">
        <div className="flex justify-between lg:flex-col lg:items-center lg:gap-2">
          <div className="w-fit flex items-end gap-2 md:flex-col md:w-full">
            <Select
              className="w-[300px] bg-gray-100 md:w-full"
              labelPlacement="outside"
              placeholder="Например, Бишкек"
              radius="none"
              renderValue={() => {
                if (filter.ByFrom) {
                  return (
                    <div>
                      <span className="">{filter.ByFrom.label}</span>
                    </div>
                  );
                }
                return (
                  <div>
                    <span className="">Например, Бишкек</span>
                  </div>
                );
              }}
            >
              {Points.map((item: any, index: number) => (
                <SelectItem
                  onClick={() =>
                    changeValue(
                      item.value === filter.ByFrom.value ? "" : item,
                      "ByFrom"
                    )
                  }
                  key={index}
                >
                  {item.label}
                </SelectItem>
              ))}
            </Select>
            <div className="md:hidden">
              <Switch setFilter={setFilter} filter={filter} />
            </div>
            <Select
              labelPlacement="outside"
              className="w-[300px] bg-gray-100 md:w-full"
              placeholder="Например, Каракол"
              radius="none"
              renderValue={() => {
                if (filter.ByTo) {
                  return (
                    <div>
                      <span className="">{filter.ByTo.label}</span>
                    </div>
                  );
                }
                return (
                  <div>
                    <span className="">Например, Каракол</span>
                  </div>
                );
              }}
            >
              {Points.map((item: any, index: number) => (
                <SelectItem
                  onClick={() =>
                    changeValue(
                      item.value === filter.ByTo.value ? "" : item,
                      "ByTo"
                    )
                  }
                  key={index}
                >
                  {item.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Select
            labelPlacement="outside"
            className="w-[250px] bg-gray-100 lg:w-full"
            placeholder="Например, Крытый"
            radius="none"
            selectionMode="multiple"
            fullWidth={true}
            renderValue={() => {
              if (carId.length) {
                return (
                  <div>
                    {carId.map((item: any, index: number) => (
                      <span key={index} className="mr-1">
                        {item.label},
                      </span>
                    ))}
                  </div>
                );
              } else {
                return (
                  <div>
                    <span className="text-grayRoot/70">Например, Крытый</span>
                  </div>
                );
              }
            }}
          >
            {Object.entries(Cars).map(([key, items]: any) => (
              <SelectSection key={key} showDivider title={TYPES_CARS[key]}>
                {items.map((item: any, itemIndex: any) => (
                  <SelectItem
                    onClick={() => handleSelectChange(item)}
                    key={`${key}-${itemIndex}`}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectSection>
            ))}
          </Select>
          <Button
            onClick={handleClose}
            className="bg-[#27272a] text-white"
            size="md"
          >
            Очистить
          </Button>
          <Button
            onClick={() => {
              setType("post");
              onOpenChange();
            }}
            className="bg-[#27272a] text-white"
            endContent={<PlusIcon />}
            size="md"
          >
            Добавить груз
          </Button>
        </div>
        <div>
          <Table
            columns={COLUMNS_CUSTOMER}
            data={data.content}
            isLoading={isLoading}
            onPageChange={(e) => setPage(+e)}
            currentPage={page}
            totalPages={data.totalPages}
          />
        </div>
      </div>
      <CreateModal
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        filter={cargoData}
        setFilter={setCargoData}
        onClose={onClose}
        cargoId={cargoId}
        type={type}
      />
    </>
  );
}
