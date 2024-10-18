import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
import { ScrollView } from "react-native";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { getUserImageSrc, uploadFile } from "../../services/imageService";
import { Image } from "react-native";
import Icon from "../../assets/icons";
import Input from "../../components/Input";
import Button from "../../components/Button";
import IOSStyleAlert from "../../components/IOSStyleAlert";
import { updateUser } from "../../services/userService";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const EditProfile = () => {
  const { user: currenUser, setUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileAlertVisible, setProfileAlertVisible] = useState(false);
  const router = useRouter();

  const [user, setUser] = useState({
    name: "",
    phoneNumber: "",
    image: null,
    bio: "",
    address: "",
  });

  useEffect(() => {
    if (currenUser) {
      setUser({
        name: currenUser.name || "",
        phoneNumber: currenUser.phone || "",
        image: currenUser.image || null,
        bio: currenUser.bio || "",
        address: currenUser.address || "",
      });
    }
  }, []);

  const onSubmit = async () => {
    let userData = { ...user };
    let { name, phoneNumber, image, address, bio } = userData;
    if (!name || !phoneNumber || !address || !bio || !image) {
      setProfileAlertVisible(true);
      return;
    }
    setLoading(true);

    if (typeof image == "object") {
      // upload image
      let imageRes = await uploadFile("profiles", image?.uri, true);
      if (imageRes.success) userData.image = imageRes.data;
      else userData.image = null;
    }

    // update user
    const res = await updateUser(currenUser?.id, userData);
    setLoading(false);
    console.log("update result: ", res);

    if (res.success) {
      setUserData({ ...currenUser, ...userData });
      router.back();
    }
  };

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.7,
    });
    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] });
    }
  };

  // let imageSource =
  //   user.image && typeof user.image == "object"? user.image.uri
  //  : getUserImageSrc(user.image);

  //
  const getImageSource = () => {
    if (user.image) {
      if (typeof user.image === "object" && user.image.uri) {
        return { uri: user.image.uri };
      } else {
        return getUserImageSrc(user.image);
      }
    }
    return getUserImageSrc(null); // This will return the default avatar
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Edit Profile" />

          {/* form */}
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image source={getImageSource()} style={styles.avatar} />
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon name="camera" size={20} strokeWidth={2.5} />
              </Pressable>
            </View>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Please fill your profile details
            </Text>
            <Input
              icon={<Icon name="user" />}
              placeholder="Enter your name"
              value={user.name}
              onChangeText={(value) => setUser({ ...user, name: value })}
            />
            <Input
              icon={<Icon name="call" />}
              placeholder="Enter your phone number"
              value={user.phoneNumber}
              onChangeText={(value) => setUser({ ...user, phoneNumber: value })}
            />
            <Input
              icon={<Icon name="location" />}
              placeholder="Enter your address"
              value={user.address}
              onChangeText={(value) => setUser({ ...user, address: value })}
            />
            <Input
              placeholder="Enter your bio"
              value={user.bio}
              multiline={true}
              containerStyle={styles.bio}
              onChangeText={(value) => setUser({ ...user, bio: value })}
            />
            <Button
              title="Update"
              loading={loading}
              hasShadow={false}
              onPress={onSubmit}
            />
          </View>
        </ScrollView>
      </View>
      <IOSStyleAlert
        visible={profileAlertVisible}
        title="Profile"
        message="Please fill all the fields!"
        onClose={() => setProfileAlertVisible(false)}
      />
    </ScreenWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  input: {
    flexDirection: "row",
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    padding: 17,
    paddingHorizontal: 20,
    gap: 15,
  },
  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
});
