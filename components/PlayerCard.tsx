
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { Player, PaymentMethod, EligibilityStatus } from '../types';
import { useTeamData } from '../hooks/useTeamData';
import Icon from './Icon';

interface PlayerCardProps {
  player: Player;
  showDetails?: boolean;
  allowEditing?: boolean;
}

export default function PlayerCard({ player, showDetails = false, allowEditing = false }: PlayerCardProps) {
  const { paymentMethods, updatePlayerPayment, updatePlayerEligibility } = useTeamData();
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<'payment' | 'eligibility' | 'amount' | null>(null);
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
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleEligibilityToggle = () => {
    const newEligibility: EligibilityStatus = player.eligibility === 'Eligible' ? 'Ineligible' : 'Eligible';
    updatePlayerEligibility(player.id, newEligibility);
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    updatePlayerPayment(player.id, player.amountPaid, method);
    setEditingField(null);
  };

  const handleAmountUpdate = () => {
    const amount = parseFloat(tempAmount) || 0;
    if (amount < 0) {
      Alert.alert('Error', 'Amount cannot be negative');
      return;
    }
    updatePlayerPayment(player.id, amount, player.paymentMethod);
    setEditingField(null);
  };

  const availablePaymentMethods = paymentMethods.map(pm => pm.name) as PaymentMethod[];
  const eligibilityOptions: EligibilityStatus[] = ['Eligible', 'Ineligible', 'Suspended', 'Injured'];

  return (
    <View style={[commonStyles.card, styles.container]}>
      <View style={styles.header}>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={commonStyles.textSecondary}>
            {player.position} • Age {calculateAge(player.dateOfBirth)}
          </Text>
        </View>
        
        <View style={styles.badges}>
          {allowEditing ? (
            <TouchableOpacity
              style={[styles.badge, { backgroundColor: getEligibilityColor(player.eligibility) }]}
              onPress={handleEligibilityToggle}
            >
              <Text style={styles.badgeText}>{player.eligibility}</Text>
              <Icon name="pencil" size={10} color={colors.background} style={styles.editIcon} />
            </TouchableOpacity>
          ) : (
            <View style={[styles.badge, { backgroundColor: getEligibilityColor(player.eligibility) }]}>
              <Text style={styles.badgeText}>{player.eligibility}</Text>
            </View>
          )}
        </View>
      </View>
      
      {showDetails && (
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date of Birth:</Text>
            <Text style={styles.detailValue}>{formatDate(player.dateOfBirth)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            {allowEditing && editingField === 'payment' ? (
              <View style={styles.editContainer}>
                {availablePaymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.optionButton,
                      player.paymentMethod === method && styles.selectedOption
                    ]}
                    onPress={() => handlePaymentMethodChange(method)}
                  >
                    <Text style={[
                      styles.optionText,
                      player.paymentMethod === method && styles.selectedOptionText
                    ]}>
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <TouchableOpacity
                style={styles.editableValue}
                onPress={() => allowEditing && setEditingField('payment')}
                disabled={!allowEditing}
              >
                <Text style={styles.detailValue}>{player.paymentMethod}</Text>
                {allowEditing && <Icon name="pencil" size={12} color={colors.textSecondary} />}
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount Paid:</Text>
            {allowEditing && editingField === 'amount' ? (
              <View style={styles.amountEditContainer}>
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
                  <Icon name="checkmark" size={16} color={colors.background} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setTempAmount(player.amountPaid.toString());
                    setEditingField(null);
                  }}
                >
                  <Icon name="close" size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.editableValue}
                onPress={() => {
                  if (allowEditing) {
                    setTempAmount(player.amountPaid.toString());
                    setEditingField('amount');
                  }
                }}
                disabled={!allowEditing}
              >
                <Text style={[styles.detailValue, { color: getPaymentStatusColor(player.amountPaid) }]}>
                  ${player.amountPaid}
                </Text>
                {allowEditing && <Icon name="pencil" size={12} color={colors.textSecondary} />}
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Available:</Text>
            <Text style={[styles.detailValue, { color: player.isAvailable ? colors.success : colors.error }]}>
              {player.isAvailable ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
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
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
  editIcon: {
    marginLeft: 2,
  },
  details: {
    marginTop: 12,
    paddingTop: 12,
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
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  editableValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: colors.backgroundAlt,
  },
  editContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    maxWidth: 200,
  },
  optionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.background,
  },
  amountEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.backgroundAlt,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
