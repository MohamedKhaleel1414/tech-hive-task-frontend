import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Modal
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

export default function Register({ navigation }: { navigation: any }) {
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [sendEmailModal, setSendEmailModal] = useState<boolean>(false);

  const registerSchema = yup.object().shape({
    username: yup.string().required("Enter your username"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Enter your email"),
    password: yup
      .string()
      .required("Enter password")
      .min(9, "Password must contain 9 digits at least"),
  });

  const register = (values: any) => {
    console.log(values)
    axios
      .post("https://techhivebe.onrender.com/register", values, {
        timeout: 20000,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          Accept: "application/json",
        },
      })
      .then((res) => {
        // console.log(res.data);
        if (res.data === "This email is registered") {
          alert(res.data);
        } else if (res.data === "This username is used") {
          alert(res.data);
        } else {
          navigation.navigate("Login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={{ backgroundColor: "lightblue", height: "100%" }}>
      <ScrollView style={{ backgroundColor: "azure" }}>
        <View style={styles.containerBG}>
          <Modal
            animationType="slide"
            visible={sendEmailModal}
            transparent={true}
            onRequestClose={() => {
              setSendEmailModal(false);
            }}
          >
            <View style={styles.modalcontent}>
              <Text style={styles.modaltext}>
                We have sent an email to you for verifying your email. Please complete verifying your email then login.
              </Text>
              <Button
                style={styles.modalbutton}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.textStyle}>Ok</Text>
              </Button>
            </View>
          </Modal>

          <View style={styles.menu}>
            <Formik
              initialValues={{ username: "", email: "", password: "" }}
              validationSchema={registerSchema}
              onSubmit={register}
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
                      label="User Name"
                      keyboardAppearance="dark"
                      placeholder="Type your username"
                      placeholderTextColor="#8b9cb5"
                      onChangeText={handleChange("username")}
                      value={values.username}
                      onBlur={() => setFieldTouched("username")}
                    />
                    {touched.username && errors.username && (
                      <Text style={styles.errorTextStyle}>
                        {errors.username}
                      </Text>
                    )}
                  </View>
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
                      keyboardAppearance="dark"
                      placeholder="Enter password"
                      placeholderTextColor="#8b9cb5"
                      autoCorrect={false}
                      autoComplete="password"
                      textContentType="password"
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
                    <Text style={styles.textStyle}>Register</Text>
                  </Button>
                  <Text style={{ alignSelf: "center" }}>
                    You already have an acoount.{" "}
                    <Text
                      style={{ textDecorationLine: "underline", color: "blue" }}
                      onPress={() => {
                        navigation.navigate("Login");
                      }}
                    >
                      Login
                    </Text>
                  </Text>
                </>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerBG: {
    backgroundColor: "azure",
    width: "100%",
    height: "100%",
  },
  menu: {
    paddingHorizontal: "5%",
    gap: 25,
  },
  textinput: {
    backgroundColor: "azure",
  },
  logoStyle: {
    width: 300,
    height: 400,
    alignSelf: "center",
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
  logoView: {
    // marginBottom: 30,
  },
  errorTextStyle: {
    color: "red",
    fontSize: 14,
    paddingVertical: 3,
  }, modalcontent: {
    position: "absolute",
    top: "43%",
    left: "15%",
    width: "70%",
    height: "14%",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5%",
    borderRadius: 18,
    shadowColor: "black",
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "#a6ffcf",
    borderWidth: 4,
    borderColor: "gold",
  },
  modaltext: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "500"
  },
  modalbutton: {
    backgroundColor: "#63deff",
    borderColor: "#0071ff",
    borderWidth: 1.5,
    width: "50%"
  }
});