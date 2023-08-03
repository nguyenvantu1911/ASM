import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import {
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [Data, setData] = useState("");
  const [modelVisible, setmodelVisible] = useState(false);
  const [modelVisible2, setmodelVisible2] = useState(false);
  const [maXe, setmaXe] = useState("");
  const [tenXe, settenXe] = useState("");
  const [giaTien, setgiaTien] = useState("");
  const [namSX, setnamSX] = useState("");
  const [image, setImage] = useState([null]);
  fetch("http://192.168.2.105:3000/all")
    .then((response) => response.json())
    .then((data) => {
      if (JSON.stringify(data) !== JSON.stringify(Data)) {
        setData(data);
        console.log("tu", data);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 5],  
      quality: 1,
    });
    setImage(result);
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("maXe", maXe);
    formData.append("tenXe", tenXe);
    formData.append("giaTien", giaTien);
    formData.append("namSX", namSX);
    formData.append("hinhAnh", image);

    const response = await fetch("http://192.168.2.105:3000/them", {
      method: "POST",
      body: formData,
    }).then((data) => {
      if (JSON.stringify(data) !== JSON.stringify(Data)) {
        setData(data);
      }
    })
    .catch((error) => {
      console.log(error);
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.log(response.status);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.a}>
        <Text style={styles.title}>Danh sách xe Oto</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setmodelVisible(true);
        }}
        style={styles.button}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          Thêm xe
        </Text>
      </TouchableOpacity>
      <FlatList
        data={Data}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: "http://192.168.2.105:3000/" + item.hinhAnh }}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Mã xe: {item.maXe}</Text>
              <Text style={styles.text}>Tên xe: {item.tenXe}</Text>
              <Text style={styles.text}>Giá tiền: {item.giaTien}</Text>
              <Text style={styles.text}>Năm SX: {item.namSX}</Text>
            </View>
            <View style={styles.icon}>
              <TouchableOpacity
                onPress={() => {
                  fetch("http://192.168.2.105:3000/deletec/" + item._id)
                    .then((response) => response.json())
                    .then((data) => {
                      if (JSON.stringify(data) !== JSON.stringify(Data)) {
                        setData(data);
                        console.log("tu", data);
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }}
              >
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/3405/3405244.png",
                  }}
                  style={styles.anh}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setmodelVisible2(true);
                }}
              >
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/1827/1827951.png",
                  }}
                  style={styles.anh}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      ></FlatList>
      <Modal animationType="slide" transparent={true} visible={modelVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.titleC}>Thêm Xe</Text>
            <TextInput
              style={styles.input}
              placeholder="Mã Xe"
              onChangeText={setmaXe}
            />
            <TextInput
              style={styles.input}
              placeholder="Tên xe"
              onChangeText={settenXe}
            />
            <TextInput
              style={styles.input}
              placeholder="Giá tiền"
              onChangeText={setgiaTien}
            />
            <TextInput
              style={styles.input}
              placeholder="Năm SX"
              onChangeText={setnamSX}
            />
            <Button title="Pick an image" onPress={pickImage} />
            {image && <Image style={{width: 200,height: 300}} source={image} />}

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity
                style={styles.nut}
                onPress={() => {
                  handleSubmit();

                  setmodelVisible(false);
                }}
              >
                <Text>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nutC}
                onPress={() => {
                  setmodelVisible(false);
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={modelVisible2}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.titleC}>Update</Text>
            <TextInput style={styles.input} placeholder="Name" />
            <TextInput style={styles.input} placeholder="Address" />
            <TextInput style={styles.input} placeholder="NumberPhone" />
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity
                style={styles.nut}
                onPress={() => {
                  setmodelVisible2(false);
                }}
              >
                <Text>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nutC}
                onPress={() => {
                  setmodelVisible2(false);
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
    overflow: "hidden",
  },
  imageContainer: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 10,
  },
  text: {
    fontSize: 16,

    marginBottom: 5,
  },
  button: {
    backgroundColor: "blue",
    height: 50,
    width: 80,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  a: {
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#fff",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleC: {
    fontSize: 30,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
    borderRadius: 10,
  },
  nut: {
    backgroundColor: "gray",
    borderRadius: 15,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  nutC: {
    backgroundColor: "white",
    borderRadius: 15,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginLeft: 20,
  },
  icon: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  anh: {
    width: 20,
    height: 20,
    marginBottom: 3,
  },
});
