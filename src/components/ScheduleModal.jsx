import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputDatePicker from "./InputDatePicker";
import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

yup.setLocale({
    mixed: {
        default: "사용할 수 없는 값입니다.",
        required: "필수 입력입니다.",
        oneOf: "다음 값 중 하나여야 합니다.: ${values}",
        notOneOf: "다음 값 중 하나가 아니어야 합니다.: ${values}",
        notType: function notType(_ref) {
            let path = _ref.path,
                type = _ref.type,
                value = _ref.value,
                originalValue = _ref.originalValue;
            let isCast = originalValue != null && originalValue !== value;
            let msg = "";
            if (type === "number") {
                msg = "숫자를 입력하세요";
            } else if (type === "date") {
                msg = "날짜 형식으로 입력해주세요.";
            } else {
                msg = path + " 항목은 `" + type + "` 형식으로 입력해주세요.";
            }

            // if (value === null) {
            //   msg +=
            //     '\n If "null" is intended as an empty value be sure to mark the schema as `.nullable()`';
            // }

            return msg;
        },
        defined: "정의되지 않았습니다.",
    },
    string: {
        length: "${length}자로 입력해주세요.",
        min: "${min}자 이상 입력바랍니다.",
        max: "${max}자 까지 입력됩니다.",
        email: "이메일 형식이 아닙니다.",
    },
});
const schema = yup
    .object({
        selectedDate: yup
            .string("문자를 입력하세요")
            .required("날짜를 입력하세요"),

        memo: yup.string("문자를 입력하세요").required("메모를 입력하세요"),
    })
    .required();

const ScheduleModal = ({ setModal }) => {
    const { Authorization } = useAuthContext();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [imagePreview, setImagePreview] = useState("");
    const image = watch("image");

    useEffect(() => {
        if (image && image.length > 0) {
            const file = image[0];
            setImagePreview(URL.createObjectURL(file));
        }
    }, [image]);

    const onSubmit = (data) => {
        // console.log(data);
        const header = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization,
            },
        };
        const formData = new FormData();
        formData.append("file", data.image && data.image[0]);
        const body = {
            siStartDate: data.selectedDate,
            siEndDate: data.selectedDate,
            siMemo: data.memo,
        };
        const blob = new Blob([JSON.stringify(body)], {
            type: "application/json",
        });
        formData.append("json", blob);
        axios
            .put(
                `${process.env.REACT_APP_API_URL}/api/calendar/put`,
                formData,
                header
            )
            .then((res) => console.log(res))
            .then(alert("스케줄이 등록되었습니다."))
            .then(setModal(false))
            .then(navigate("/"))
            .catch((err) => console.log(err));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <p>시작날짜</p>
            <InputDatePicker control={control} {...register("selectedDate")} />

            <span className="text-red-500 pl-10">
                {errors.selectedDate && errors.selectedDate.message}
            </span>
            {/* <p>끝날짜</p>
            <InputDatePicker control={control} {...register("siEndDate")} />

            <span className="text-red-500 pl-10">
                {errors.siEndDate && errors.siEndDate.message}
            </span> */}

            <p>이미지 업로드</p>
            <input
                {...register("image")}
                id="picture"
                type="file"
                name="image"
                accept="image/*"
                className="focus:outline-none mb-3"
            />
            <img
                src={imagePreview}
                alt="imagePreview"
                className="max-w-[55%] mb-4"
            />

            <label>
                메모 <br /> <input {...register("memo")} />
            </label>
            <span className="text-red-500 pl-10">{errors.memo?.message}</span>
            <button onClick={handleSubmit(onSubmit)}>전송</button>
        </form>
    );
};

export default ScheduleModal;
