import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Modal,
  FlatList
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Formik } from "formik";
import * as yup from "yup";
import { axiosOperations } from "../config/operationsAxios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Todo({ navigation }: { navigation: any }) {
  const [addTodoModal, setAddTodoModal] = useState<boolean>(false);
  const [updateTodoModal, setUpdateTodoModal] = useState<boolean>(false);
  const [todos, setTodos] = useState<any>(null)
  const [notodos, setNotodos] = useState<boolean>(true)
  const [addednewtodo, setAddednewtodo] = useState<boolean>(false)
  const [myData, setMyData] = useState<any>(null);


  const todoSchema = yup.object().shape({
    title: yup.string().required("Enter The Title"),
    description: yup.string().required("Enter The description"),
  });

  const saveTodo = (values: any) => {
    console.log(values)
    axiosOperations.post('/createtodo', values).then((res: any) => {
      console.log(res.data)
      setAddTodoModal(false)
      setAddednewtodo(!addednewtodo)
    }).catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => {
    async function getdata() {
      let data: any = await AsyncStorage.getItem("userdata");
      let savedUserData = await JSON.parse(data);
      setMyData(savedUserData);
      axiosOperations.get(`/retrievetodos/`).then((res: any) => {
        console.log(res.data)
        if (res.data.length === 0) {
          setNotodos(true)
        } else {
          setTodos(res.data)
          setNotodos(false)
        }
      }).catch((err) => {
        console.log(err);
      });
    }
    getdata()
  }, [addednewtodo])

  const updateTodo = (values:any) => {
    console.log(values)
    axiosOperations.patch('/updatetodo', values).then((res)=>{
      console.log(res.data)
      setAddednewtodo(!addednewtodo)
    }).catch((err)=>{
      console.log(err)
    })
  }

  const deleteTodo = (todoid: number) => {
    axiosOperations.delete('/deletetodo', {
      headers: {
        "todoid": todoid,
      }
    }).then((res) => {
      console.log(res.data)
      setAddednewtodo(!addednewtodo)
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <SafeAreaView style={{ backgroundColor: "lightblue", height: "100%" }}>
      <ScrollView style={{ backgroundColor: "azure" }}>
        <View style={styles.containerBG}>
          <View>
            <Modal
              animationType="slide"
              visible={addTodoModal}
              transparent={true}
              onRequestClose={() => {
                setAddTodoModal(false);
              }}
            >
              <View style={styles.modalcontent}>
                <Formik
                  initialValues={{ title: "", description: "", userId: myData?.id }}
                  validationSchema={todoSchema}
                  onSubmit={saveTodo}
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
                      <View style={{ width: "100%" }}>
                        <TextInput
                          style={styles.textinput}
                          mode="outlined"
                          label="Title"
                          keyboardAppearance="dark"
                          placeholder="Type title"
                          placeholderTextColor="#8b9cb5"
                          onChangeText={handleChange("title")}
                          value={values.title}
                          onBlur={() => setFieldTouched("title")}
                        />
                        {touched.title && errors.title && (
                          <Text style={styles.errorTextStyle}>
                            {errors.title}
                          </Text>
                        )}
                      </View>
                      <View style={{ width: "100%" }}>
                        <TextInput
                          multiline={true}
                          numberOfLines={6}
                          style={styles.textinput}
                          mode="outlined"
                          label="Description"
                          keyboardAppearance="dark"
                          placeholder="Type description"
                          placeholderTextColor="#8b9cb5"
                          onChangeText={handleChange("description")}
                          value={values.description}
                          onBlur={() => setFieldTouched("description")}
                        />
                        {touched.description && errors.description && (
                          <Text style={styles.errorTextStyle}>
                            {errors.description}
                          </Text>
                        )}
                      </View>
                      <Button
                        style={styles.buttonStyle}
                        onPress={handleSubmit}
                        disabled={!isValid}
                      >
                        <Text style={styles.textStyle}>Add</Text>
                      </Button>
                      <Button
                        style={styles.buttonStyle}
                        onPress={() => setAddTodoModal(false)}
                      >
                        <Text style={styles.textStyle}>Close</Text>
                      </Button>
                    </>
                  )}
                </Formik>
              </View>
            </Modal>
            {notodos ? (
              <View style={styles.notodosStyle}><Text style={{ fontSize: 20, fontWeight: "600" }}>Nothing to do right now!</Text></View>
            ) : (
              <>
                {todos.map((item: any, index: number) => {
                  return (
                    <FlatList
                      key={index}
                      data={[item]}
                      renderItem={({ item }) => (
                        <View style={styles.listStyle}>
                          <View style={styles.titleStyle}>
                            <Text style={{ fontSize: 20 }}>
                              {item.title}
                            </Text>
                          </View>
                          <View>
                            <Text>{item.description}</Text>
                          </View>
                          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
                            <View>
                              <Button style={{ marginVertical: 10 }} onPress={() => setUpdateTodoModal(true)}><Text style={{ color: "orange" }}>Update</Text></Button>
                            </View>
                            <View>
                              <Button style={{ marginVertical: 10 }} onPress={() => deleteTodo(item.id)}><Text style={{ color: "red" }}>Delete</Text></Button>
                            </View>
                          </View>
                          <Modal
                            animationType="slide"
                            visible={updateTodoModal}
                            transparent={true}
                            onRequestClose={() => {
                              setUpdateTodoModal(false);
                            }}
                          >
                            <View style={styles.modalcontent}>
                              <Formik
                                initialValues={{ title: "", description: "", id: item.id }}
                                validationSchema={todoSchema}
                                onSubmit={updateTodo}
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
                                    <View style={{ width: "100%" }}>
                                      <TextInput
                                        style={styles.textinput}
                                        mode="outlined"
                                        label="Title"
                                        keyboardAppearance="dark"
                                        placeholder="Type title"
                                        placeholderTextColor="#8b9cb5"
                                        onChangeText={handleChange("title")}
                                        value={values.title}
                                        onBlur={() => setFieldTouched("title")}
                                      />
                                      {touched.title && errors.title && (
                                        <Text style={styles.errorTextStyle}>
                                          {errors.title}
                                        </Text>
                                      )}
                                    </View>
                                    <View style={{ width: "100%" }}>
                                      <TextInput
                                        multiline={true}
                                        numberOfLines={6}
                                        style={styles.textinput}
                                        mode="outlined"
                                        label="Description"
                                        keyboardAppearance="dark"
                                        placeholder="Type description"
                                        placeholderTextColor="#8b9cb5"
                                        onChangeText={handleChange("description")}
                                        value={values.description}
                                        onBlur={() => setFieldTouched("description")}
                                      />
                                      {touched.description && errors.description && (
                                        <Text style={styles.errorTextStyle}>
                                          {errors.description}
                                        </Text>
                                      )}
                                    </View>
                                    <Button
                                      style={styles.buttonStyle}
                                      onPress={handleSubmit}
                                      disabled={!isValid}
                                    >
                                      <Text style={styles.textStyle}>Update</Text>
                                    </Button>
                                    <Button
                                      style={styles.buttonStyle}
                                      onPress={() => setUpdateTodoModal(false)}
                                    >
                                      <Text style={styles.textStyle}>Close</Text>
                                    </Button>
                                  </>
                                )}
                              </Formik>
                            </View>
                          </Modal>
                        </View>
                      )}
                    />
                  )
                })}
              </>
            )}
            <View style={{ marginTop: 50 }}>
              <Button onPress={() => setAddTodoModal(true)}><Text>Add Todo</Text></Button>
              <Button
                onPress={async () => {
                  await AsyncStorage.clear();
                  navigation.navigate("Login");
                }}
              ><Text>Log out</Text></Button>
            </View>
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
  notodosStyle: {
    alignSelf: "center", marginTop: 25
  },
  listStyle: {
    padding: 20, borderBottomWidth: 1
  },
  titleStyle: {
    paddingVertical: 4
  },
  modalcontent: {
    position: "absolute",
    top: "20%",
    left: "15%",
    width: "70%",
    height: "50%",
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
  textinput: {
    backgroundColor: "azure"
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
});