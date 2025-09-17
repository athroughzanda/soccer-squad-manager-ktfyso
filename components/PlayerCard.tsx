
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { getCommonStyles, getColors } from '../styles/commonStyles';
import { Player, PaymentMethod, EligibilityStatus } from '../types';
import { useTeamData } from '../hooks/useTeamData';
import { useTheme } from '../contexts/ThemeContext';
import Icon from './Icon';

interface PlayerCardProps {
  player: Player;
  showDetails?: boolean;
  allowEditing?: boolean;
}

export default function PlayerCard({ player, showDetails = false, allowEditing = false }: PlayerCardProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const commonStyles = getCommonStyles(isDark);
  
  const { paymentMethods, updatePlayerEligibility, updatePlayerPaymentMethod, updatePlayerAmount } = useTeamData();
  const [editingAmount, setEditingAmount] = useState(false);
  const [tempAmount, setTempAmount] = useState(player.amountPaid.toString());

  const getEligibilityColor = (eligibility: string) => {
    switch (eligibility) {
      case 'Eligible': return colors.success;
      case 'Ineligible': return colors.error;
      case 'Suspended': return colors.warning;
      case 'Injured': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getPaymentStatusColor = (amountPaid: number) => {
    return amountPaid > 0 ? colors.success : colors.error;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleEligibilityToggle = () => {
    const eligibilityOptions: EligibilityStatus[] = ['Eligible', 'Ineligible', 'Suspended', 'Injured'];
    const currentIndex = eligibilityOptions.indexOf(player.eligibility);
    const nextIndex = (currentIndex + 1) % eligibilityOptions.length;
    const newEligibility = eligibilityOptions[nextIndex];
    
    updatePlayerEligibility(player.id, newEligibility);
    console.log('Player eligibility updated:', player.name, newEligibility);
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    updatePlayerPaymentMethod(player.id, method);
    console.log('Player payment method updated:', player.name, method);
  };

  const handleAmountUpdate = () => {
    const amount = parseFloat(tempAmount) || 0;
    if (amount < 0) {
      Alert.alert('Error', 'Amount cannot be negative');
      return;
    }
    updatePlayerAmount(player.id, amount);
    setEditingAmount(false);
    console.log('Player amount updated:', player.name, amount);
  };

  const styles = getStyles(colors);

  return (
    <View style={commonStyles.card}>
      <View style={styles.header}>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={commonStyles.textSecondary}>
            {player.position} • Age {calculateAge(player.dateOfBirth)}
          </Text>
        </View>
        
        <View style={styles.badges}>
          <View style={[
            styles.eligibilityBadge,
            { backgroundColor: getEligibilityColor(player.eligibility) }
          ]}>
            <Text style={styles.badgeText}>{player.eligibility}</Text>
          </View>
        </View>
      </View>

      {showDetails && (
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date of Birth:</Text>
            <Text style={styles.detailValue}>{formatDate(player.dateOfBirth)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Eligibility:</Text>
            {allowEditing ? (
              <TouchableOpacity
                style={styles.editableField}
                onPress={handleEligibilityToggle}
              >
                <Text style={[styles.detailValue, { color: getEligibilityColor(player.eligibility) }]}>
                  {player.eligibility}
                </Text>
                <Icon name="chevron-down" size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            ) : (
              <Text style={[styles.detailValue, { color: getEligibilityColor(player.eligibility) }]}>
                {player.eligibility}
              </Text>
            )}
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            {allowEditing ? (
              <View style={styles.paymentMethodOptions}>
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.paymentOption,
                      player.paymentMethod === method.name && styles.selectedPaymentOption
                    ]}
                    onPress={() => handlePaymentMethodChange(method.name as PaymentMethod)}
                  >
                    <Text style={[
                      styles.paymentOptionText,
                      player.paymentMethod === method.name && styles.selectedPaymentOptionText
                    ]}>
                      {method.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.detailValue}>{player.paymentMethod}</Text>
            )}
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount Paid:</Text>
            {allowEditing && editingAmount ? (
              <View style={styles.amountEditContainer}>
                <Text style={styles.dollarSign}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  value={tempAmount}
                  onChangeText={setTempAmount}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleAmountUpdate}
                >
                  <Icon name="checkmark" size={14} color={colors.background} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setEditingAmount(false);
                    setTempAmount(player.amountPaid.toString());
                  }}
                >
                  <Icon name="close" size={14} color={colors.text} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={allowEditing ? styles.editableAmount : undefined}
                onPress={allowEditing ? () => {
                  setTempAmount(player.amountPaid.toString());
                  setEditingAmount(true);
                } : undefined}
              >
                <Text style={[
                  styles.detailValue,
                  { color: getPaymentStatusColor(player.amountPaid) }
                ]}>
                  ${player.amountPaid}
                </Text>
                {allowEditing && (
                  <Icon name="pencil" size={12} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  badges: {
    alignItems: 'flex-end',
  },
  eligibilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
  details: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  editableField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: colors.backgroundAlt,
  },
  editableAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: colors.backgroundAlt,
  },
  paymentMethodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
    justifyContent: 'flex-end',
  },
  paymentOption: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  selectedPaymentOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  paymentOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  selectedPaymentOptionText: {
    color: colors.background,
  },
  amountEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dollarSign: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.background,
    minWidth: 60,
  },
  saveButton: {
    backgroundColor: colors.success,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.backgroundAlt,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
