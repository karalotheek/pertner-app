import React, { useEffect, useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useCookies } from "react-cookie";
import { APISERVICE } from "@api/RestClient";
import { REGISTER_USER, GET_USER } from "@constant/api";

function UserRegistrationModal({ onClose, open, gender }) {
    const dispatch = useDispatch();
    const [cookie, setCookie] = useCookies();
    const [userCookie, setUserCookie] = useState(cookie['user']);
    const [showWellcomeScreen, setShowWellcomeScreen] = useState(false);
    const [showRegistrationScreen, setShowRegistrationScreen] = useState(false);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState({
        mobileNo: '',
        firstName: '',
        lastName: '',
        email: '',
        area: '',
    })

    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        const wellcomeScreenTime = cookie['wst'];
        const registrationScreenTime = cookie['rst'];
        if (!userCookie && !registrationScreenTime) {
            // console.log('time expiry registrationScreenTime');
            setShowWellcomeScreen(false);
            setShowRegistrationScreen(true);
            setCookie("rst", new Date(), { //registration-screen-time
                path: "/",
                expires: new Date(new Date().setMinutes(new Date().getMinutes() + 30)),
                sameSite: true,
            })
        } else if (userCookie && !wellcomeScreenTime) {
            // console.log('time expiry wellcomeScreenTime');
            setShowRegistrationScreen(false);
            setShowWellcomeScreen(true);
            setCookie("wst", new Date(), { //wellcome-screen-time
                path: "/",
                expires: new Date(new Date().setMinutes(new Date().getMinutes() + 30)),
                sameSite: true,
            })
        } else {
            handleClose();
        }
    }, [])
    const wrongEmail = () => {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(userData.email)) return false;
        else return true;
    }
    const proceed = () => {
        if (!userData || !userData.mobileNo || userData.mobileNo.length != 10) {
            setError('phone');
            return;
        } else if (!userData.firstName) {
            setError('firstName');
            return;
        } else {
            if (userData.email && wrongEmail()) {
                setError('email');
                return;
            }
            setError('');
            if (userData?.mobileNo && userData?.mobileNo.length == 10 && userData?.firstName) {
                const user = {
                    "mobileNo": userData.mobileNo,
                    "firstName": userData.firstName,
                    "lastName": userData.lastName,
                    "email": userData.email,
                    "area": userData.area,
                }
                setCookie("user", user, { //user registration fields
                    path: "/",
                    expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    sameSite: true,
                })
                setUserCookie(userData)
                setShowRegistrationScreen(false);
                // setShowWellcomeScreen(true);
                // setCookie("wst", new Date(), { //wellcome-screen-time
                //     path: "/",
                //     expires: new Date(new Date().setMinutes(new Date().getMinutes() + 30)),
                //     sameSite: true,
                // })
                APISERVICE.POST(REGISTER_USER, userData).then((res) => {
                    console.log(res);
                })
                handleClose();
            }
        }
    }

    const getUserDetails = (mobileNo) => {
        return new Promise((res, rej) => {
            const fetchPromise = fetch(`${GET_USER}/${mobileNo}`);
            fetchPromise
                .then((response) => {
                    const data = response.json()
                    res(data);
                }).catch(function (error) {
                    rej(error);
                    console.log("error");
                });
        });
    }

    const onPhoneChange = (mobileNo) => {
        let num = mobileNo.charAt(mobileNo.length - 1).replace(".", '');
        if (num && num != ' ' && !isNaN(num)) {
            setUserData({ ...userData, mobileNo: mobileNo });
            if (mobileNo && mobileNo.length == 10) {
                getUserDetails(mobileNo).then((data: any) => {
                    if (data && data.length) {
                        const user = data[0];
                        setUserCookie(user);
                        setCookie("user", user, { //user registration fields
                            path: "/",
                            expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                            sameSite: true,
                        })
                        setShowRegistrationScreen(false);
                        setShowWellcomeScreen(true);
                        setCookie("wst", new Date(), { //wellcome-screen-time
                            path: "/",
                            expires: new Date(new Date().setMinutes(new Date().getMinutes() + 30)),
                            sameSite: true,
                        })
                    }
                })
                    .catch((e) => console.log(e))
            }
        }
    }
    return (
        <div className="user-reg-modal-wrap">
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>

                {showRegistrationScreen && <div className="fullwidth user-reg-wrap">
                    <div className="registrationcover">
                        <DialogTitle id="simple-dialog-title">We will use your information to send offers and promotions</DialogTitle>
                        <div className="fullwidth">
                            <div className="input-wrap">
                                {/* <div className="input-txt">Mobile Number<span className="mandatory">*</span></div> */}
                                <input className="input" value={userData.mobileNo} onChange={(e) => onPhoneChange(e.target.value)} minLength={10} maxLength={10} placeholder="Mobile Number" />
                                {error == 'phone' && <div className="error">Please enter valid mobile number</div>}
                            </div>
                            <div className="input-wrap">
                                {/* <div className="input-txt">First Name<span className="mandatory">*</span></div> */}
                                <input className="input" value={userData.firstName} onChange={(e) => setUserData({ ...userData, firstName: e.target.value })} placeholder="Name" />
                                {error == 'firstName' && <div className="error">Please enter name</div>}
                            </div>
                            <div className="input-wrap">
                                {/* <div className="input-txt">Email</div> */}
                                <input className="input" type="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} placeholder="Email" />
                                {error == 'email' && <div className="error">Please enter valid email</div>}
                            </div>
                            <div className="user-regIcon" >
                                <Button onClick={() => proceed()}>Proceed To Makeover</Button>
                            </div>
                            <div className="user-skip" >
                                <Button onClick={handleClose}>Skip</Button>
                            </div>
                        </div>
                    </div>
                </div>}

                {showWellcomeScreen && <div className="wellcome-wrap" style={{ backgroundImage: ` url("../assets/images/welcome_back_bg.png")` }}>
                    <div className="modal-close" onClick={handleClose}>
                        <img src="../assets/Icons/cancel_button.png" />
                    </div>
                    <div className="fullwidth user-well-wrap">
                        <div className="user-name">{userCookie?.firstName}</div>
                        <div className="user-skip" >
                            <Button onClick={handleClose}>Skip</Button>
                        </div>
                    </div>
                </div>}

            </Dialog>
        </div>
    );
}

export default UserRegistrationModal;