import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, View, TouchableOpacity, FlatList, Text, StyleSheet, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Button from './Button';
import { aliasTokens } from '../theme/alias';

type DobValue = { year?: number; month?: number; day?: number };

interface DobBottomSheetProps {
    /** Controls visibility of the DOB bottom sheet */
    visible: boolean;
    /** Current DOB value to seed wheels when opened */
    value?: DobValue;
    /** Called when user presses outside or requests close */
    onClose: () => void;
    /** Called when user taps Save with the finalized values */
    onSave: (value: Required<DobValue>) => void;
}

// Constants
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
] as const;

const ITEM_HEIGHT = 34;
const VISIBLE_ROWS = 7;
const LIST_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;
const SIDE_SPACER_COUNT = Math.floor(VISIBLE_ROWS / 2);
const SCROLL_END_DELAY = 150;
const MIN_AGE = 13;

/**
 * Build an inclusive numeric range [start, end].
 * Example: generateRange(1, 3) -> [1, 2, 3]
 */
const generateRange = (start: number, end: number) => {
    const arr: number[] = [];
    for (let i = start; i <= end; i += 1) arr.push(i);
    return arr;
};

/**
 * Convert a vertical offset into the index of the item visually centered in the wheel.
 * Includes clamping to ensure returned index is within bounds.
 */
const getCenteredIndex = (offsetY: number, dataLen: number) => {
    const raw = Math.round(offsetY / ITEM_HEIGHT);
    return Math.max(0, Math.min(dataLen - 1, raw));
};

/**
 * Opacity curve for items away from the center. Tweakable for desired visual weight.
 */
const getFadeOpacity = (distance: number) => {
    switch (distance) {
        case 0: return 1;     // centered row
        case 1: return 0.70;
        case 2: return 0.40;
        case 3: return 0.20;
        default: return 0.5;
    }
};

interface WheelProps<T> {
    data: readonly T[];
    ref: React.RefObject<FlatList<T> | null>;
    offsetRef: React.MutableRefObject<number>;
    centeredIndex: number | undefined;
    onScroll: (offset: number) => void;
    onScrollEnd: (offset: number) => void;
    renderItem: (item: T, index: number, selected: boolean, distance: number) => React.ReactNode;
    keyExtractor: (item: T, index: number) => string;
    type: 'month' | 'day' | 'year';
}

/**
 * Reusable wheel component for date picker
 */
const Wheel = <T,>({ 
    data, 
    ref, 
    offsetRef, 
    centeredIndex, 
    onScroll, 
    onScrollEnd, 
    renderItem, 
    keyExtractor,
    type 
}: WheelProps<T>) => {
    const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offset = e.nativeEvent.contentOffset.y;
        offsetRef.current = offset;
        onScroll(offset);
        onScrollEnd(offset);
    }, [offsetRef, onScroll, onScrollEnd]);

    const wrappedData = useMemo(() => [
        ...Array(SIDE_SPACER_COUNT).fill(''),
        ...data,
        ...Array(SIDE_SPACER_COUNT).fill('')
    ], [data]);

    return (
        <View style={styles.wheelWrapper}>
            <FlatList
                ref={ref}
                data={wrappedData}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                renderItem={({ index }) => {
                    const isSpacer = index < SIDE_SPACER_COUNT || index >= SIDE_SPACER_COUNT + data.length;
                    if (isSpacer) {
                        return <View style={{ height: ITEM_HEIGHT }} />;
                    }
                    
                    const actualIndex = index - SIDE_SPACER_COUNT;
                    const item = data[actualIndex];
                    const currentCentered = centeredIndex ?? getCenteredIndex(offsetRef.current, data.length);
                    const distance = Math.abs(currentCentered - actualIndex);
                    const selected = currentCentered === actualIndex;
                    
                    return renderItem(item, actualIndex, selected, distance) as React.ReactElement;
                }}
            />
        </View>
    );
};

const DobBottomSheet: React.FC<DobBottomSheetProps> = ({ visible, value, onClose, onSave }) => {
    // Local DOB values (seeded by props)
    const [dobYear, setDobYear] = useState<number | undefined>(value?.year);
    const [dobMonth, setDobMonth] = useState<number | undefined>(value?.month);
    const [dobDay, setDobDay] = useState<number | undefined>(value?.day);
    const [isValidAge, setIsValidAge] = useState(true);

    // Scroll end detection
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Refs for each wheel
    const monthListRef = useRef<FlatList<string>>(null);
    const dayListRef = useRef<FlatList<number>>(null);
    const yearListRef = useRef<FlatList<number>>(null);

    // Track scroll offsets
    const monthOffsetRef = useRef(0);
    const dayOffsetRef = useRef(0);
    const yearOffsetRef = useRef(0);

    // Track centered indices
    const [monthCenteredIndex, setMonthCenteredIndex] = useState<number | undefined>(undefined);
    const [dayCenteredIndex, setDayCenteredIndex] = useState<number | undefined>(undefined);
    const [yearCenteredIndex, setYearCenteredIndex] = useState<number | undefined>(undefined);

    // Data options
    const dayOptions = useMemo(() => {
        if (!dobYear || !dobMonth) return generateRange(1, 31);
        const daysInMonth = new Date(dobYear, dobMonth, 0).getDate();
        return generateRange(1, daysInMonth);
    }, [dobYear, dobMonth]);

    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return generateRange(currentYear - 60, currentYear);
    }, []);

    // Scroll handlers
    const handleScrollEnd = useCallback((scrollOffset: number, type: 'year' | 'month' | 'day') => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            const snapOffset = Math.round(scrollOffset / ITEM_HEIGHT) * ITEM_HEIGHT;
            
            if (type === 'year') {
                const index = getCenteredIndex(scrollOffset, yearOptions.length);
                setDobYear(yearOptions[index]);
                yearListRef.current?.scrollToOffset({ offset: snapOffset });
            } else if (type === 'month') {
                const index = getCenteredIndex(scrollOffset, MONTH_NAMES.length);
                setDobMonth(index + 1);
                monthListRef.current?.scrollToOffset({ offset: snapOffset });
            } else if (type === 'day') {
                const index = getCenteredIndex(scrollOffset, dayOptions.length);
                setDobDay(dayOptions[index]);
                dayListRef.current?.scrollToOffset({ offset: snapOffset });
            }
        }, SCROLL_END_DELAY);
    }, [yearOptions, dayOptions]);

    // Commit current centered values when tapping the center band
    const commitCurrentCenteredValues = useCallback(() => {
        const mIndex = monthCenteredIndex ?? getCenteredIndex(monthOffsetRef.current, MONTH_NAMES.length);
        const dIndex = dayCenteredIndex ?? getCenteredIndex(dayOffsetRef.current, dayOptions.length);
        const yIndex = yearCenteredIndex ?? getCenteredIndex(yearOffsetRef.current, yearOptions.length);
        setDobMonth(mIndex + 1);
        setDobDay(dayOptions[dIndex]);
        setDobYear(yearOptions[yIndex]);
    }, [monthCenteredIndex, dayCenteredIndex, yearCenteredIndex, dayOptions, yearOptions]);

    // Render functions for each wheel type
    const renderMonthItem = useCallback((month: string, index: number, selected: boolean, distance: number) => (
        <View style={[styles.item, styles.itemForMonth]}>
            <Text style={[styles.itemText, { opacity: getFadeOpacity(distance) }]}>
                {month}
            </Text>
        </View>
    ), []);

    const renderDayItem = useCallback((day: number, index: number, selected: boolean, distance: number) => (
        <View style={styles.item}>
            <Text style={[styles.itemText, { opacity: getFadeOpacity(distance) }]}>
                {day}
            </Text>
        </View>
    ), []);

    const renderYearItem = useCallback((year: number, index: number, selected: boolean, distance: number) => (
        <View style={[styles.item, styles.itemForYear]}>
            <Text style={[styles.itemText, { opacity: getFadeOpacity(distance) }]}>
                {year}
            </Text>
        </View>
    ), []);

    // Initialize wheels when modal opens
    useEffect(() => {
        if (!visible) return;
        
        requestAnimationFrame(() => {
            const monthIndex = dobMonth ? dobMonth - 1 : 0;
            monthListRef.current?.scrollToIndex({ index: monthIndex, animated: false });
            monthOffsetRef.current = monthIndex * ITEM_HEIGHT;
            setMonthCenteredIndex(monthIndex);

            const dayIndex = dobDay ? dayOptions.indexOf(dobDay) : 0;
            dayListRef.current?.scrollToIndex({ index: dayIndex, animated: false });
            dayOffsetRef.current = dayIndex * ITEM_HEIGHT;
            setDayCenteredIndex(Math.max(0, dayIndex));

            const yearIndex = dobYear ? Math.max(0, yearOptions.indexOf(dobYear)) : 0;
            yearListRef.current?.scrollToIndex({ index: yearIndex, animated: false });
            yearOffsetRef.current = yearIndex * ITEM_HEIGHT;
            setYearCenteredIndex(yearIndex);
        });
    }, [visible, dobMonth, dobDay, dobYear, dayOptions, yearOptions]);

    // Validate age
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const yIndex = yearCenteredIndex ?? getCenteredIndex(yearOffsetRef.current, yearOptions.length);
        const selectedYear = yearOptions[yIndex];
        setIsValidAge(currentYear - selectedYear >= MIN_AGE);
    }, [yearCenteredIndex, yearOptions]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    // Save the selected date
    const handleSave = useCallback(() => {
        const mIndex = monthCenteredIndex ?? getCenteredIndex(monthOffsetRef.current, MONTH_NAMES.length);
        const dIndex = dayCenteredIndex ?? getCenteredIndex(dayOffsetRef.current, dayOptions.length);
        const yIndex = yearCenteredIndex ?? getCenteredIndex(yearOffsetRef.current, yearOptions.length);

        const selectedMonth = mIndex + 1;
        const selectedDay = dayOptions[dIndex];
        const selectedYear = yearOptions[yIndex];

        setDobMonth(selectedMonth);
        setDobDay(selectedDay);
        setDobYear(selectedYear);
        onSave({ year: selectedYear, month: selectedMonth, day: selectedDay });
    }, [monthCenteredIndex, dayCenteredIndex, yearCenteredIndex, dayOptions, yearOptions, onSave]);

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose} />
                <View style={styles.sheet}>
                    <View style={styles.handleBar} />

                    <View style={styles.pickerRowContainer}>
                        <TouchableOpacity style={styles.rowCenterOverlay} activeOpacity={0.7} onPress={commitCurrentCenteredValues} />

                        <View style={styles.pickerRow}>
                            <Wheel
                                data={MONTH_NAMES}
                                ref={monthListRef}
                                offsetRef={monthOffsetRef}
                                centeredIndex={monthCenteredIndex}
                                onScroll={(offset) => setMonthCenteredIndex(getCenteredIndex(offset, MONTH_NAMES.length))}
                                onScrollEnd={(offset) => handleScrollEnd(offset, 'month')}
                                renderItem={renderMonthItem}
                                keyExtractor={(_, idx) => `m-${idx}`}
                                type="month"
                            />

                            <View style={styles.pickerColumn}>
                                <Wheel
                                    data={dayOptions}
                                    ref={dayListRef}
                                    offsetRef={dayOffsetRef}
                                    centeredIndex={dayCenteredIndex}
                                    onScroll={(offset) => setDayCenteredIndex(getCenteredIndex(offset, dayOptions.length))}
                                    onScrollEnd={(offset) => handleScrollEnd(offset, 'day')}
                                    renderItem={renderDayItem}
                                    keyExtractor={(_, idx) => `d-${idx}`}
                                    type="day"
                                />
                            </View>

                            <Wheel
                                data={yearOptions}
                                ref={yearListRef}
                                offsetRef={yearOffsetRef}
                                centeredIndex={yearCenteredIndex}
                                onScroll={(offset) => setYearCenteredIndex(getCenteredIndex(offset, yearOptions.length))}
                                onScrollEnd={(offset) => handleScrollEnd(offset, 'year')}
                                renderItem={renderYearItem}
                                keyExtractor={(_, idx) => `y-${idx}`}
                                type="year"
                            />
                        </View>
                    </View>

                    <Button title="Save" onPress={handleSave} disabled={!isValidAge} style={styles.saveButton} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        flex: 1,
    },
    sheet: {
        backgroundColor: aliasTokens.color.background.Primary,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: aliasTokens.spacing.Medium,
        paddingBottom: aliasTokens.spacing.Large,
    },
    handleBar: {
        width: 52,
        height: 4,
        backgroundColor: aliasTokens.color.border.Default,
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 4,
        marginBottom: 36,
    },
    pickerRowContainer: {
        position: 'relative',
    },
    pickerRow: {
        ...aliasTokens.basic.dFlexBetween
    },
    pickerColumn: {
        flex: 1,
    },
    wheelWrapper: {
        height: LIST_HEIGHT,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: aliasTokens.borderRadius.Default,
    },
    rowCenterOverlay: {
        position: 'absolute',
        height: ITEM_HEIGHT,
        top: (LIST_HEIGHT - ITEM_HEIGHT) / 2,
        backgroundColor: aliasTokens.input.FillEnabled,
        opacity: 0.92,
        borderRadius: aliasTokens.borderRadius.Small,
        width: aliasTokens.sizes.full
    },
    item: {
        ...aliasTokens.basic.dFlexCenter,
        height: ITEM_HEIGHT,
    },
    itemText: {
        ...aliasTokens.typography.body.Medium,
        color: aliasTokens.color.text.Primary,
        fontSize: 14,
    },
    itemForMonth: {
        justifyContent: 'flex-start',
        paddingLeft: 50
    },
    itemForYear: {
        justifyContent: 'flex-end',
        paddingRight: 70
    },
    saveButton: {
        marginTop: aliasTokens.spacing.XLarge,
    },
});

export default DobBottomSheet;


