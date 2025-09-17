
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getCommonStyles, getColors, getButtonStyles } from '../styles/commonStyles';
import { Player, PlayerPosition, PaymentMethod } from '../types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import { useTeamData } from '../hooks/useTeamData';
import { useTheme } from '../contexts/ThemeContext';

interface AddPlayerFormProps {
  onAddPlayer: (player: Omit<Player, 'id'>) => void;
  onCancel: () => void;
  teamId?: string;
}

export default function AddPlayerForm({ onAddPlayer, onCancel, teamId }: AddPlayerFormProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const commonStyles = getCommonStyles(isDark);
  const buttonStyles = getButtonStyles(isDark);
  
  const { paymentMethods } = useTeamData();
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [position, setPosition] = useState<PlayerPosition>('Forward');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Card');
  const [amountPaid, setAmountPaid] = useState('0');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const positions: PlayerPosition[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
  const availablePaymentMethods = paymentMethods.map(pm => pm.name) as PaymentMethod[];

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a player name');
      return;
    }

    const newPlayer: Omit<Player, 'id'> = {
      name: name.trim(),
      dateOfBirth,
      position,
      paymentMethod,
      amountPaid: parseFloat(amountPaid) || 0,
      teamIds: teamId ? [teamId] : [],
      isAvailable: true,
      eligibility: 'Eligible',
    };

    onAddPlayer(newPlayer);
    console.log('Adding new player:', newPlayer);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const styles = getStyles(colors);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={commonStyles.subtitle}>Add New Player</Text>
      
      <View style={styles.form}>
        <Text style={commonStyles.inputLabel}>Player Name</Text>
        <TextInput
          style={commonStyles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter player name"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={commonStyles.inputLabel}>Date of Birth</Text>
        <TouchableOpacity
          style={[commonStyles.input, styles.dateButton]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {dateOfBirth.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}

        <Text style={commonStyles.inputLabel}>Position</Text>
        <View style={styles.optionGrid}>
          {positions.map((pos) => (
            <TouchableOpacity
              key={pos}
              style={[
                styles.optionButton,
                position === pos && styles.selectedOption
              ]}
              onPress={() => setPosition(pos)}
            >
              <Text style={[
                styles.optionText,
                position === pos && styles.selectedOptionText
              ]}>
                {pos}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={commonStyles.inputLabel}>Payment Method</Text>
        <View style={styles.paymentMethodGrid}>
          {availablePaymentMethods.map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.optionButton,
                paymentMethod === method && styles.selectedOption
              ]}
              onPress={() => setPaymentMethod(method)}
            >
              <Text style={[
                styles.optionText,
                paymentMethod === method && styles.selectedOptionText
              ]}>
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={commonStyles.inputLabel}>Amount Paid ($)</Text>
        <TextInput
          style={commonStyles.input}
          value={amountPaid}
          onChangeText={setAmountPaid}
          placeholder="0"
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[buttonStyles.secondary, styles.button]}
          onPress={onCancel}
        >
          <Text style={[commonStyles.text, { color: colors.text }]}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[buttonStyles.primary, styles.button]}
          onPress={handleSubmit}
        >
          <Text style={[commonStyles.text, { color: colors.background }]}>Add Player</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    padding: 20,
    maxHeight: 600,
  },
  form: {
    marginBottom: 24,
  },
  dateButton: {
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  paymentMethodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.background,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
