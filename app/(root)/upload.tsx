import { View, Text, TouchableOpacity, TextInput, Modal, FlatList, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { router } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const categories = [
  { label: 'Books', value: 'books' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Furniture', value: 'furniture' },
  { label: 'Others', value: 'others' },
];

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
                    <MaterialIcons name="check" size={24} color="#3498DB" />
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

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [price, setPrice] = useState("");

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  return (
    <SafeAreaView className='bg-backgroundUpload h-full'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
        keyboardVerticalOffset={10}
      >
        <View className='px-5 border-b border-b-borderPrimary pb-4 mb-5'>
          <View className="flex flex-row items-center justify-center mt-5 relative">
            <Text className="text-2xl font-bold text-textPrimary">List Your Item</Text>
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
            <Text className='text-lg font-medium text-textSecondary mb-2'>Add up to 5 photos. The first is the cover.</Text>
            <View className='h-36 w-36 border-2 border-dashed border-borderPrimary rounded-xl relative'>
              <TouchableOpacity className='h-full w-full justify-center items-center' activeOpacity={0.5}>
                <View className='flex gap-2 absolute inset-0 justify-center items-center'>
                  <MaterialCommunityIcons name='camera-plus-outline' size={40} color='#7F8C8D' />
                  <Text className='text-textSecondary font-medium text-lg'>Add Photo</Text>
                </View>
              </TouchableOpacity>
            </View>
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
                className='border-[1.5px] border-borderPrimary p-4 bg-background rounded-lg text-lg font-medium'
              />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View className='px-5 w-full mt-5'>
        <TouchableOpacity className='bg-primary p-4 rounded-lg' activeOpacity={0.5}>
          <Text className='text-white text-center text-xl font-bold'>List Item</Text>
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