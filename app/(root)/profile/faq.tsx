import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import FAQItem from "@/components/profile/FaqItem";
import ProfileSection from "@/components/profile/ProfileSection";

const FAQ = () => {
    const router = useRouter();

    const faqData = [
        {
            category: "Getting Started",
            questions: [
                {
                    question: "How do I create an account?",
                    answer:
                        "To create an account, tap the 'Sign Up' button on the welcome screen. You'll need to provide your university email address, create a password, and verify your email. Only students with valid university email addresses can join CampusTrade.",
                },
                {
                    question: "Is CampusTrade free to use?",
                    answer:
                        "Yes! CampusTrade is completely free to use. We don't charge any listing fees or transaction fees. Our platform is designed to help students buy and sell items within their university community without any costs.",
                },
                {
                    question: "What universities are supported?",
                    answer:
                        "Currently, CampusTrade supports major universities including Harvard, Stanford, MIT, UCLA, Princeton, and Yale. We're constantly expanding to include more universities. If your university isn't listed, please contact us!",
                },
            ],
        },
        {
            category: "Buying & Selling",
            questions: [
                {
                    question: "How do I list an item for sale?",
                    answer:
                        "Tap the '+' button at the bottom center of the screen. Add up to 5 photos of your item, write a title and description, select a category, and set your price. Make sure to be honest about the item's condition!",
                },
                {
                    question: "How do payments work?",
                    answer:
                        "CampusTrade facilitates connections between buyers and sellers, but payment arrangements are made directly between users. We recommend meeting in safe, public places on campus and using trusted payment methods like Venmo or Zelle.",
                },
                {
                    question: "Can I negotiate prices?",
                    answer:
                        "Absolutely! Use the messaging feature to communicate with sellers and negotiate prices. Many sellers are open to reasonable offers, especially for items that have been listed for a while.",
                },
                {
                    question: "What items are not allowed?",
                    answer:
                        "Prohibited items include weapons, illegal substances, stolen goods, counterfeit items, and anything that violates university policies. Listings that violate these terms will be removed, and accounts may be suspended.",
                },
            ],
        },
        {
            category: "Safety & Trust",
            questions: [
                {
                    question: "How do I stay safe when meeting buyers/sellers?",
                    answer:
                        "Always meet in well-lit, public places on campus like the library or student center. Bring a friend if possible. Never share personal banking information. Trust your instincts - if something feels wrong, cancel the transaction.",
                },
                {
                    question: "What if I have a problem with a transaction?",
                    answer:
                        "While we don't handle transactions directly, you can report problematic users through the app. We take user safety seriously and will investigate reports. For serious issues, contact campus security or local authorities.",
                },
                {
                    question: "How do I report a suspicious listing or user?",
                    answer:
                        "Tap the three dots menu on any listing or in a conversation and select 'Report'. Choose the reason for reporting and provide details. Our team reviews all reports within 24 hours.",
                },
            ],
        },
        {
            category: "Account & Privacy",
            questions: [
                {
                    question: "How do I change my password?",
                    answer:
                        "Go to Profile > Settings > Change Password. You'll need to enter your current password and then create a new one. Make sure your new password is strong and unique.",
                },
                {
                    question: "Can other users see my email address?",
                    answer:
                        "By default, your email is hidden from other users. You can control privacy settings in Profile > Settings > Privacy. We recommend keeping personal contact information private until you've established trust with another user.",
                },
                {
                    question: "How do I delete my account?",
                    answer:
                        "Go to Profile > Settings > Delete Account. Please note that this action is permanent and cannot be undone. All your listings will be removed and your data will be deleted from our servers.",
                },
            ],
        },
    ];

    return (
        <SafeAreaView className="bg-background h-full">
            <View className="px-5 border-b border-b-borderPrimary pb-4">
                <View className="flex flex-row items-center justify-center mt-5 relative">
                    <Text className="text-2xl font-bold text-textPrimary">
                        Frequently Asked Questions
                    </Text>
                    <TouchableOpacity
                        className="absolute left-0"
                        onPress={() => router.back()}
                        activeOpacity={0.5}
                    >
                        <MaterialIcons name="chevron-left" size={28} color="#2C3E50" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {faqData.map((section, index) => (
                    <ProfileSection key={index} title={section.category}>
                        {section.questions.map((faq, faqIndex) => (
                            <FAQItem
                                key={faqIndex}
                                question={faq.question}
                                answer={faq.answer}
                                showBorder={faqIndex !== section.questions.length - 1}
                            />
                        ))}
                    </ProfileSection>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default FAQ;