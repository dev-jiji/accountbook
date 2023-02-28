import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { SlClose } from "react-icons/sl";

const schema = yup
    .object({
        name: yup.string("문자를 입력하세요").required("이름을 입력하세요"),
        email: yup.string("문자를 입력하세요").required("메일을 입력하세요"),
        birth: yup.string("문자를 입력하세요").required("생일을 입력하세요"),
    })
    .required();

const SearchPwModal = ({ setSearchPw }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
        const body = {
            name: data.name,
            email: data.email,
            birth: data.birth,
        };
        axios
            .post(
                `${process.env.REACT_APP_API_URL}/api/member/findpassword`,
                body
            )
            .then((res) => console.log(res))
            .then(setSearchPw(false))
            .catch((err) => console.log(err));
    };

    const handleClose = () => {
        setSearchPw(false);
    };
    const inpustStlye =
        "outline-none mb-5 mt-2 focus:border-none focus:outline-main rounded-xl px-3";
    return (
        <div className="w-full h-full absolute bg-black bg-opacity-50 z-10 top-0 p-60 px-96 ">
            <div className="bg-white rounded-xl py-4">
                <div className="w-full text-center">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label className="text-2xl">
                            이름
                            <br />
                            <input
                                className={inpustStlye}
                                {...register("name")}
                            />
                        </label>
                        <p>{errors.name?.message}</p>

                        <label className="text-2xl">
                            이메일
                            <br />
                            <input
                                className={inpustStlye}
                                {...register("email")}
                            />
                        </label>
                        <p>{errors.email?.message}</p>

                        <label className="text-2xl">
                            생일
                            <br />
                            <input
                                className={inpustStlye}
                                {...register("birth")}
                                placeholder="yyyy-mm-dd"
                            />
                        </label>
                        <p>{errors.birth?.message}</p>

                        <button className="text-2xl bg-main rounded-xl p-3 mb-3 mr-6">
                            비밀번호 찾기
                        </button>
                        <button
                            onClick={handleClose}
                            type="button"
                            className="text-2xl bg-main rounded-xl p-3 mb-3"
                        >
                            닫기
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SearchPwModal;
