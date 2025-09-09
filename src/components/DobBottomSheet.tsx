import React, { useMemo, useRef, useState } from 'react';
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

// Human-readable month names used for the month wheel
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Visual constants governing the wheel appearance and behavior
const ITEM_HEIGHT = 34;
// Show 7 visible rows instead of 5
const VISIBLE_ROWS = 7;
const LIST_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;
const SIDE_SPACER_COUNT = Math.floor(VISIBLE_ROWS / 2);

/**
 * Build an inclusive numeric range [start, end].
 * Example: generateRange(1, 3) -> [1, 2, 3]
 */
const generateRange = (start: number, end: number) => {
    const arr: number[] = [];
    for (let i = start; i <= end; i += 1) arr.push(i);
    return arr;
};

const DobBottomSheet: React.FC<DobBottomSheetProps> = ({ visible, value, onClose, onSave }) => {
    // Local, ephemeral DOB values (seeded by props). We only commit to parent on Save.
    const [dobYear, setDobYear] = useState<number | undefined>(value?.year);
    const [dobMonth, setDobMonth] = useState<number | undefined>(value?.month);
    const [dobDay, setDobDay] = useState<number | undefined>(value?.day);

    // Day options depend on the selected month/year to account for variable month lengths and leap years
    const dayOptions = useMemo(() => {
        if (!dobYear || !dobMonth) return generateRange(1, 31);
        const daysInMonth = new Date(dobYear, dobMonth, 0).getDate();
        return generateRange(1, daysInMonth);
    }, [dobYear, dobMonth]);

    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return generateRange(currentYear - 60, currentYear);
    }, []);

    // Refs to each wheel list (month/day/year)
    const monthListRef = useRef<FlatList<string>>(null);
    const dayListRef = useRef<FlatList<number>>(null);
    const yearListRef = useRef<FlatList<number>>(null);

    // Track live scroll offsets so we can compute the centered index at any time
    const monthOffsetRef = useRef(0);
    const dayOffsetRef = useRef(0);
    const yearOffsetRef = useRef(0);

    // These mirror the currently centered visible row for each wheel (visual selection)
    const [monthCenteredIndex, setMonthCenteredIndex] = useState<number | undefined>(undefined);
    const [dayCenteredIndex, setDayCenteredIndex] = useState<number | undefined>(undefined);
    const [yearCenteredIndex, setYearCenteredIndex] = useState<number | undefined>(undefined);

    /**
     * Convert a vertical offset into the index of the item visually centered in the wheel.
     * Includes clamping to ensure returned index is within bounds.
     */
    const getCenteredIndex = (offsetY: number, dataLen: number) => {
        // With SIDE_SPACER_COUNT items added before data, the centered data index
        // equals the current top index (rounded). No +/- spacer adjustment needed.
        const raw = Math.round(offsetY / ITEM_HEIGHT);
        return Math.max(0, Math.min(dataLen - 1, raw));
    };

    /**
     * Generate a momentum-end handler that snaps and commits the selection for a given wheel.
     * The `onSelect` will receive the value index within the non-spacer data array.
     */
    const onSnap = (dataLength: number, onSelect: (valueIndex: number) => void) =>
        (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            const offsetY = e.nativeEvent.contentOffset.y;
            const clamped = getCenteredIndex(offsetY, dataLength);
            onSelect(clamped);
        };

    /**
     * Read the current centered UI indices and commit them into local DOB state.
     * This allows tapping the highlighted band to "lock in" the current visual selection.
     */
    const commitCurrentCenteredValues = () => {
        const mIndex = monthCenteredIndex ?? getCenteredIndex(monthOffsetRef.current, monthNames.length);
        const dIndex = dayCenteredIndex ?? getCenteredIndex(dayOffsetRef.current, dayOptions.length);
        const yIndex = yearCenteredIndex ?? getCenteredIndex(yearOffsetRef.current, yearOptions.length);
        setDobMonth(mIndex + 1);
        setDobDay(dayOptions[dIndex]);
        setDobYear(yearOptions[yIndex]);
    };

    /**
     * Render a single row in a wheel with selected styling.
     */
    const renderWheelItem = (label: string | number, selected: boolean, distanceFromCenter: number, type: string) => (
        <View style={[
            styles.item,
            type === 'month' && styles.itemForMonth,
            type === 'year' && styles.itemForYear,
        ]}>
            <Text
                style={[
                    styles.itemText,
                    // Apply a fade based on how far the row is from the center selection
                    { opacity: getFadeOpacity(distanceFromCenter) },
                ]}
            >
                {label}
            </Text>
        </View>
    );

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

    // When the modal opens, position each wheel to reflect the current DOB values
    React.useEffect(() => {
        if (!visible) return;
        requestAnimationFrame(() => {
            // Scroll each wheel so that the desired value is centered.
            // Because the data arrays are wrapped with SIDE_SPACER_COUNT leading items,
            // the visual index to center an actual data index `k` is `k + SIDE_SPACER_COUNT`.
            const monthIndex = (dobMonth ? dobMonth - 1 : 0);
            // Scroll so that data[monthIndex] is centered (top index = monthIndex)
            monthListRef.current?.scrollToIndex({ index: monthIndex, animated: false });
            monthOffsetRef.current = monthIndex * ITEM_HEIGHT;
            setMonthCenteredIndex(monthIndex);

            const dayIndex = (dobDay ? dayOptions.indexOf(dobDay) : 0);
            dayListRef.current?.scrollToIndex({ index: dayIndex, animated: false });
            dayOffsetRef.current = dayIndex * ITEM_HEIGHT;
            setDayCenteredIndex(Math.max(0, dayIndex));

            let yearIndex = 0;
            if (dobYear) {
                const found = yearOptions.indexOf(dobYear);
                yearIndex = Math.max(0, found);
            }
            yearListRef.current?.scrollToIndex({ index: yearIndex, animated: false });
            yearOffsetRef.current = yearIndex * ITEM_HEIGHT;
            setYearCenteredIndex(yearIndex);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    /**
     * Finalize selection and return the chosen date to the parent.
     * Reads the centered rows directly (no reliance on async setState).
     */
    const handleSave = () => {
        const mIndex = monthCenteredIndex ?? getCenteredIndex(monthOffsetRef.current, monthNames.length);
        const dIndex = dayCenteredIndex ?? getCenteredIndex(dayOffsetRef.current, dayOptions.length);
        const yIndex = yearCenteredIndex ?? getCenteredIndex(yearOffsetRef.current, yearOptions.length);

        const selectedMonth = mIndex + 1;
        const selectedDay = dayOptions[dIndex];
        const selectedYear = yearOptions[yIndex];

        // Keep local state in sync (optional), then notify parent
        setDobMonth(selectedMonth);
        setDobDay(selectedDay);
        setDobYear(selectedYear);
        onSave({ year: selectedYear, month: selectedMonth, day: selectedDay });
    };

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose} />
                <View style={styles.sheet}>
                    <View style={styles.handleBar} />

                    <View style={styles.pickerRowContainer}>
                        {/* Tapping the highlighted center band commits the currently centered values */}
                        <TouchableOpacity style={styles.rowCenterOverlay} activeOpacity={0.7} onPress={commitCurrentCenteredValues} />

                        <View style={styles.pickerRow}>
                            <View>
                                <View style={styles.wheelWrapper}>
                                    <FlatList
                                        ref={monthListRef}
                                        data={[...Array(SIDE_SPACER_COUNT).fill(''), ...monthNames, ...Array(SIDE_SPACER_COUNT).fill('')]}
                                        keyExtractor={(_, idx) => `m-${idx}`}
                                        showsVerticalScrollIndicator={false}
                                        snapToInterval={ITEM_HEIGHT}
                                        // initialScrollIndex is derived via effect and explicit scroll
                                        decelerationRate="fast"
                                        getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
                                        onScroll={(e) => {
                                            monthOffsetRef.current = e.nativeEvent.contentOffset.y;
                                            setMonthCenteredIndex(getCenteredIndex(monthOffsetRef.current, monthNames.length));
                                        }}
                                        scrollEventThrottle={16}
                                        onMomentumScrollEnd={(e) => {
                                            const handler = onSnap(monthNames.length, (i) => setDobMonth(i + 1));
                                            handler(e);
                                        }}
                                        renderItem={({ index }) => {
                                            // Add leading/trailing spacer rows so the first/last real item can center
                                            const isSpacer = index < SIDE_SPACER_COUNT || index >= SIDE_SPACER_COUNT + monthNames.length;
                                            if (isSpacer) return <View style={{ height: ITEM_HEIGHT }} />;
                                            const actualIndex = index - SIDE_SPACER_COUNT;
                                            const currentCentered = monthCenteredIndex ?? getCenteredIndex(monthOffsetRef.current, monthNames.length);
                                            const distance = Math.abs(currentCentered - actualIndex);
                                            const selected = currentCentered === actualIndex;
                                            return renderWheelItem(monthNames[actualIndex], selected, distance, 'month');
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={styles.pickerColumn}>
                                <View style={styles.wheelWrapper}>
                                    <FlatList
                                        ref={dayListRef}
                                        data={[...Array(SIDE_SPACER_COUNT).fill(0), ...dayOptions, ...Array(SIDE_SPACER_COUNT).fill(0)]}
                                        keyExtractor={(_, idx) => `d-${idx}`}
                                        showsVerticalScrollIndicator={false}
                                        snapToInterval={ITEM_HEIGHT}
                                        // initialScrollIndex is derived via effect and explicit scroll
                                        decelerationRate="fast"
                                        getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
                                        onScroll={(e) => {
                                            dayOffsetRef.current = e.nativeEvent.contentOffset.y;
                                            setDayCenteredIndex(getCenteredIndex(dayOffsetRef.current, dayOptions.length));
                                        }}
                                        scrollEventThrottle={16}
                                        onMomentumScrollEnd={(e) => {
                                            const handler = onSnap(dayOptions.length, (i) => setDobDay(dayOptions[i]));
                                            handler(e);
                                        }}
                                        renderItem={({ index }) => {
                                            // Add leading/trailing spacer rows so the first/last real item can center
                                            const isSpacer = index < SIDE_SPACER_COUNT || index >= SIDE_SPACER_COUNT + dayOptions.length;
                                            if (isSpacer) return <View style={{ height: ITEM_HEIGHT }} />;
                                            const actualIndex = index - SIDE_SPACER_COUNT;
                                            const value = dayOptions[actualIndex];
                                            const currentCentered = dayCenteredIndex ?? getCenteredIndex(dayOffsetRef.current, dayOptions.length);
                                            const distance = Math.abs(currentCentered - actualIndex);
                                            const selected = currentCentered === actualIndex;
                                            return renderWheelItem(value, selected, distance, 'day');
                                        }}
                                    />
                                </View>
                            </View>

                            <View>
                                <View style={styles.wheelWrapper}>
                                    <FlatList
                                        ref={yearListRef}
                                        data={[...Array(SIDE_SPACER_COUNT).fill(0), ...yearOptions, ...Array(SIDE_SPACER_COUNT).fill(0)]}
                                        keyExtractor={(_, idx) => `y-${idx}`}
                                        showsVerticalScrollIndicator={false}
                                        snapToInterval={ITEM_HEIGHT}
                                        // initialScrollIndex is derived via effect and explicit scroll
                                        decelerationRate="fast"
                                        getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
                                        onScroll={(e) => {
                                            yearOffsetRef.current = e.nativeEvent.contentOffset.y;
                                            setYearCenteredIndex(getCenteredIndex(yearOffsetRef.current, yearOptions.length));
                                        }}
                                        scrollEventThrottle={16}
                                        onMomentumScrollEnd={(e) => {
                                            const handler = onSnap(yearOptions.length, (i) => setDobYear(yearOptions[i]));
                                            handler(e);
                                        }}
                                        renderItem={({ index }) => {
                                            // Add leading/trailing spacer rows so the first/last real item can center
                                            const isSpacer = index < SIDE_SPACER_COUNT || index >= SIDE_SPACER_COUNT + yearOptions.length;
                                            if (isSpacer) return <View style={{ height: ITEM_HEIGHT }} />;
                                            const actualIndex = index - SIDE_SPACER_COUNT;
                                            const value = yearOptions[actualIndex];
                                            const currentCentered = yearCenteredIndex ?? getCenteredIndex(yearOffsetRef.current, yearOptions.length);
                                            const distance = Math.abs(currentCentered - actualIndex);
                                            const selected = currentCentered === actualIndex;
                                            return renderWheelItem(value, selected, distance, 'year');
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    <Button title="Save" onPress={handleSave} disabled={false} style={styles.saveButton} />
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
        paddingBottom: aliasTokens.spacing.Medium,
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


