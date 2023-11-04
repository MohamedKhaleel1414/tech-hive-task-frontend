import React, { useState } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Text,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { TextInput, Button } from "react-native-paper";
import { axiosLogin } from "../config/loginAxios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }: { navigation: any }) {
    const [showPassword, setShowPassword] = useState(true);
    const loginSchema = yup.object().shape({
        email: yup
            .string()
            .email("Invalid email address")
            .required("Enter your email"),
        password: yup.string().required("Enter password"),
    });
    const login = (values: any) => {
        console.log(values)
        axiosLogin.post('/login', values).then((res) => {
            console.log(res.data)
            let saved = JSON.stringify(res.data)
            // console.log(saved)
            AsyncStorage.setItem("userdata", saved)
            navigation.navigate("Todo")
        }).catch((err) => {
            console.log(err.message);
            if (err.message.includes("403")) {
                alert("Your email is not verified");
            } else if (err.message.includes("401")) {
                alert("Invalid email or password");
            } else {
                alert(err.message)
            }
        });
    };
    return (
        <SafeAreaView style={{ backgroundColor: "lightblue", height: "100%" }}>
            <ScrollView style={{ backgroundColor: "azure" }}>
                <View style={styles.containerBG}>
                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={loginSchema}
                        onSubmit={login}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            errors,
                            touched,
                            values,
                            setFieldTouched,
                            isValid,
                        }) => (
                            <>
                                <View>
                                    <TextInput
                                        style={styles.textinput}
                                        mode="outlined"
                                        label="Email"
                                        autoCorrect={false}
                                        autoComplete="email"
                                        keyboardAppearance="dark"
                                        inputMode="email"
                                        autoCapitalize="none"
                                        placeholder="Type your email"
                                        placeholderTextColor="#8b9cb5"
                                        onChangeText={handleChange("email")}
                                        value={values.email.toLowerCase()}
                                        onBlur={() => setFieldTouched("email")}
                                    />
                                    {touched.email && errors.email && (
                                        <Text style={styles.errorTextStyle}>{errors.email}</Text>
                                    )}
                                </View>
                                <View>
                                    <TextInput
                                        style={styles.textinput}
                                        mode="outlined"
                                        label="Password"
                                        placeholder="Enter password"
                                        placeholderTextColor="#8b9cb5"
                                        autoCorrect={false}
                                        autoComplete="password"
                                        textContentType="password"
                                        keyboardAppearance="dark"
                                        secureTextEntry={showPassword}
                                        right={
                                            <TextInput.Icon
                                                icon="eye"
                                                onPress={() => {
                                                    setShowPassword(!showPassword);
                                                }}
                                            />
                                        }
                                        onChangeText={handleChange("password")}
                                        value={values.password}
                                        onBlur={() => setFieldTouched("password")}
                                    />
                                    {touched.password && errors.password && (
                                        <Text style={styles.errorTextStyle}>
                                            {errors.password}
                                        </Text>
                                    )}
                                </View>
                                <Button
                                    style={styles.buttonStyle}
                                    onPress={handleSubmit}
                                    disabled={!isValid}
                                >
                                    <Text style={styles.textStyle}>Login</Text>
                                </Button>
                                <Text style={{ alignSelf: "center" }}>
                                    First time here.{" "}
                                    <Text
                                        style={{ textDecorationLine: "underline", color: "blue" }}
                                        onPress={() => {
                                            navigation.navigate("Register");
                                        }}
                                    >
                                        Register
                                    </Text>
                                </Text>
                            </>
                        )}
                    </Formik>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    containerBG: {
        backgroundColor: "azure",
        gap: 25,
        paddingHorizontal: "5%", paddingVertical: "5%",
    },
    textinput: {
        backgroundColor: "azure",
    },
    buttonStyle: {
        borderWidth: 1,
        borderColor: "lightblue",
        width: "60%",
        backgroundColor: "#63deff",
        // borderWidth: 1.5,
        // borderColor: isvalid ? "#0071ff" : "#0071ff30",
        alignSelf: "center",
    },
    textStyle: {
        fontSize: 20,
        fontWeight: "600",
        color: "azure",
    },
    errorTextStyle: {
        color: "red",
        fontSize: 14,
        paddingVertical: 3,
    },
});