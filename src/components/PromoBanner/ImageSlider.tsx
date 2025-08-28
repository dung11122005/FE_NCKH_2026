import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView, Image, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const sliderMargin = 16;
const sliderWidth = width - sliderMargin * 2;
const sliderHeight = 220;

interface ImageSliderProps {
    images: any[]; // array of require() images hoặc {uri: ""}
    autoScrollInterval?: number; // ms, default 3000
}

const ImageSlider: React.FC<ImageSliderProps> = (props: ImageSliderProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<ScrollView>(null);

    const { images, autoScrollInterval } = props


    // Auto scroll
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prev => {
                const next = (prev + 1) % images.length;
                scrollRef.current?.scrollTo({
                    x: next * (sliderWidth + sliderMargin),
                    animated: true,
                });
                return next;
            });
        }, autoScrollInterval);

        return () => clearInterval(interval);
    }, [images, autoScrollInterval]);

    // Handle manual scroll
    const handleScroll = (event: any) => {
        const slide = Math.round(
            event.nativeEvent.contentOffset.x / (sliderWidth + sliderMargin)
        );
        if (slide !== activeIndex) setActiveIndex(slide);
    };

    return (
        <View style={styles.sliderOuter}>
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled={false}
                snapToInterval={sliderWidth + sliderMargin}
                decelerationRate="fast"
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingRight: sliderMargin }}
            >
                {images.map((img, index) => (
                    <View key={index} style={styles.sliderImageWrapper}>
                        <Image source={img} style={styles.sliderImage} />
                    </View>
                ))}
            </ScrollView>
            <View style={styles.indicatorContainer}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[styles.indicator, index === activeIndex ? styles.activeIndicator : null]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sliderOuter: { marginBottom: 5 },
    sliderImageWrapper: { width: sliderWidth, height: sliderHeight, borderRadius: 12, overflow: "hidden", marginRight: sliderMargin },
    sliderImage: { width: "100%", height: "100%", resizeMode: "cover" },
    indicatorContainer: { flexDirection: "row", justifyContent: "center", marginTop: 8 },
    indicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#ccc", marginHorizontal: 4 },
    activeIndicator: { backgroundColor: "#007bff" },
});

export default ImageSlider;
