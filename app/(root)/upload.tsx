import { View, Text, TouchableOpacity, TextInput, Modal, FlatList, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useProductStore } from '@/store/useProductStore'
import { productService } from '@/api/services/product'
import Toast from 'react-native-toast-message'
import * as ImagePicker from "expo-image-picker"
import { categories } from "@/utils/constants"

const MAX_IMAGES = 5;

const CategoryModal = ({ showCategoryModal, setShowCategoryModal, category, setCategory }: { showCategoryModal: boolean; setShowCategoryModal: React.Dispatch<React.SetStateAction<boolean>>; category: string | null; setCategory: React.Dispatch<React.SetStateAction<string | null>> }) => {
  return (
    <Modal
      visible={showCategoryModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowCategoryModal(false)}
    >
      <TouchableOpacity
        className='flex-1 justify-end'
        activeOpacity={1}
        onPress={() => setShowCategoryModal(false)}
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View className='bg-white rounded-t-3xl p-5'>
            <View className='flex-row justify-between items-center mb-4'>
              <Text className='text-xl font-bold text-textPrimary'>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <MaterialIcons name="close" size={28} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={categories}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setCategory(item.value);
                    setShowCategoryModal(false);
                  }}
                  className="p-4 border-b border-borderPrimary flex-row justify-between items-center"
                  activeOpacity={0.5}
                >
                  <Text className={`text-lg font-medium ${category === item.value ? 'text-primary font-semibold' : 'text-textPrimary'}`}>
                    {item.label}
                  </Text>
                  {category === item.value && (
                    <MaterialIcons name="check" size={24} color="#72C69B" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}

const Upload = () => {
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const isEditMode = !!editId;

  const { createProduct, updateProduct, products, isLoading } = useProductStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    if (isEditMode && editId) {
      loadProductData(Number(editId));
    }
  }, [editId]);

  const loadProductData = async (productId: number) => {
    setIsLoadingProduct(true);
    try {
      const cachedProduct = products.find(p => p.id === productId);
      
      if (cachedProduct) {
        setTitle(cachedProduct.title || "");
        setDescription(cachedProduct.description || "");
        setCategory(cachedProduct.category || null);
        setPrice(cachedProduct.price?.toString() || "");
        setImages(cachedProduct.images || []);
      } else {
        const product = await productService.getProductById(productId);
        setTitle(product.title || "");
        setDescription(product.description || "");
        setCategory(product.category || null);
        setPrice(product.price?.toString() || "");
        setImages(product.images || []);
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load product data'
      });
      router.back();
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({ type: 'error', text1: 'Permission to access gallery is required!' });
      return;
    }

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      Toast.show({ type: 'error', text1: `You can only upload up to ${MAX_IMAGES} images.` });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      quality: 0.7,
    })

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages((prev) => [...prev, ...newImages]);
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  const handleSubmit = async () => {
    if (images.length === 0) {
      Toast.show({ type: 'error', text1: 'Please add at least one photo' });
      return;
    }
    if (!title.trim()) {
      Toast.show({ type: 'error', text1: 'Please enter item name' });
      return;
    }
    if (!category) {
      Toast.show({ type: 'error', text1: 'Please select a category' });
      return;
    }
    if (!description.trim()) {
      Toast.show({ type: 'error', text1: 'Please enter description' });
      return;
    }
    if (!price.trim()) {
      Toast.show({ type: 'error', text1: 'Please enter price' });
      return;
    }

    try {
      if (isEditMode && editId) {
        await updateProduct(Number(editId), {
          title: title.trim(),
          description: description.trim(),
          price: parseFloat(price.trim()),
          category: category,
          images: images
        });

        Toast.show({
          type: 'success',
          text1: 'Success!',
          text2: 'Your listing has been updated'
        });
      } else {
        await createProduct({
          title: title.trim(),
          description: description.trim(),
          price: parseFloat(price.trim()),
          category: category,
          images: images
        });

        Toast.show({
          type: 'success',
          text1: 'Success!',
          text2: 'Your item has been listed'
        });
      }

      setTitle("");
      setDescription("");
      setCategory(null);
      setPrice("");
      setImages([]);

      router.back();

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: isEditMode ? 'Failed to update listing' : 'Failed to list item',
        text2: error.message || 'Please try again'
      });
    }
  };

  // Loading state when fetching product data
  if (isLoadingProduct) {
    return (
      <SafeAreaView className='bg-backgroundUpload h-full'>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#72C69B" />
          <Text className="text-textSecondary mt-4">Loading listing...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='bg-backgroundUpload h-full'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
        keyboardVerticalOffset={10}
      >
        <View className='px-5 border-b border-b-borderPrimary pb-4 mb-5'>
          <View className="flex flex-row items-center justify-center mt-5 relative">
            <Text className="text-2xl font-bold text-textPrimary">
              {isEditMode ? "Edit Listing" : "List Your Item"}
            </Text>
            <TouchableOpacity className='absolute left-0' onPress={() => router.back()} activeOpacity={0.5}>
              <MaterialIcons name="arrow-back" size={32} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
          className="flex-1"
        >
          <View className='px-5 flex gap-2 mb-5'>
            <Text className='text-black font-bold text-3xl'>Add Photos</Text>
            <Text className='text-lg font-medium text-textSecondary mb-2'>
              Add up to {MAX_IMAGES} photos. The first is the cover. ({images.length}/{MAX_IMAGES})
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className='flex-row gap-3'>
                {images.map((uri, index) => (
                  <View key={index} className='h-36 w-36 rounded-xl overflow-hidden relative'>
                    <Image source={{ uri }} className='h-full w-full' resizeMode='cover' />

                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      className='absolute top-2 right-2 bg-black/50 rounded-full p-1'
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="close" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}

                {images.length < MAX_IMAGES && (
                  <View className='h-36 w-36 border-2 border-dashed border-borderPrimary rounded-xl'>
                    <TouchableOpacity
                      className='h-full w-full justify-center items-center'
                      activeOpacity={0.5}
                      onPress={pickImages}
                    >
                      <View className='flex gap-2 items-center'>
                        <MaterialCommunityIcons name='camera-plus-outline' size={40} color='#7F8C8D' />
                        <Text className='text-textSecondary font-medium text-lg'>Add Photo</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>

          <View className='px-5 flex gap-3'>
            <View className='flex gap-2'>
              <Text className='text-black text-xl font-medium'>Item Name</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g, Introduction to Psychology Textbook"
                placeholderTextColor="#7F8C8D"
                className='border-[1.5px] border-borderPrimary p-4 bg-background rounded-lg text-lg font-medium'
              />
            </View>

            <View className='flex gap-2'>
              <Text className='text-black text-xl font-medium'>Category</Text>
              <TouchableOpacity
                onPress={() => setShowCategoryModal(true)}
                className='border-[1.5px] border-borderPrimary p-4 bg-background rounded-lg flex-row justify-between items-center'
                activeOpacity={0.5}
              >
                <Text className={`text-lg font-medium ${category ? 'text-textPrimary' : 'text-textSecondary'}`}>
                  {category ? categories.find(cat => cat.value === category)?.label : 'Select a category'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#7F8C8D" />
              </TouchableOpacity>
            </View>

            <View className='flex gap-2'>
              <Text className='text-black text-xl font-medium'>Description</Text>
              <TextInput
                multiline
                numberOfLines={2}
                value={description}
                onChangeText={setDescription}
                placeholder="e.g, A comprehensive guide to psychology concepts and theories."
                placeholderTextColor="#7F8C8D"
                className='border-[1.5px] border-borderPrimary p-4 bg-background rounded-lg text-lg font-medium'
              />
            </View>

            <View className='flex gap-2'>
              <Text className='text-black text-xl font-medium'>Price</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="$ 0.00"
                placeholderTextColor="#7F8C8D"
                keyboardType="numeric"
                className='border-[1.5px] border-borderPrimary p-4 bg-background rounded-lg text-lg font-medium'
              />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View className='px-5 w-full mt-5'>
        <TouchableOpacity 
          className={`${isLoading ? "bg-primary/50" : "bg-primary"} p-4 rounded-lg`} 
          activeOpacity={0.5} 
          onPress={handleSubmit} 
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className='text-white text-center text-xl font-bold'>
              {isEditMode ? "Update Listing" : "List Item"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <CategoryModal
        showCategoryModal={showCategoryModal}
        setShowCategoryModal={setShowCategoryModal}
        category={category}
        setCategory={setCategory}
      />
    </SafeAreaView>
  )
}

export default Upload