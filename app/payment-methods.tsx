
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getCommonStyles, getColors, getButtonStyles } from '../styles/commonStyles';
import CenterModal from '../components/CenterModal';
import Icon from '../components/Icon';
import { useTeamData } from '../hooks/useTeamData';
import { useTheme } from '../contexts/ThemeContext';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const commonStyles = getCommonStyles(isDark);
  const buttonStyles = getButtonStyles(isDark);
  
  const { paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = useTeamData();
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [showEditMethod, setShowEditMethod] = useState(false);
  const [newMethodName, setNewMethodName] = useState('');
  const [editingMethod, setEditingMethod] = useState<{ id: string; name: string } | null>(null);

  const handleAddMethod = () => {
    if (!newMethodName.trim()) {
      Alert.alert('Error', 'Please enter a payment method name');
      return;
    }

    if (paymentMethods.some(pm => pm.name.toLowerCase() === newMethodName.trim().toLowerCase())) {
      Alert.alert('Error', 'This payment method already exists');
      return;
    }

    addPaymentMethod(newMethodName.trim());
    setNewMethodName('');
    setShowAddMethod(false);
    console.log('Payment method added:', newMethodName.trim());
  };

  const handleEditMethod = (id: string, currentName: string) => {
    setEditingMethod({ id, name: currentName });
    setNewMethodName(currentName);
    setShowEditMethod(true);
  };

  const handleUpdateMethod = () => {
    if (!newMethodName.trim() || !editingMethod) {
      Alert.alert('Error', 'Please enter a valid payment method name');
      return;
    }

    if (paymentMethods.some(pm => 
      pm.id !== editingMethod.id && 
      pm.name.toLowerCase() === newMethodName.trim().toLowerCase()
    )) {
      Alert.alert('Error', 'This payment method already exists');
      return;
    }

    updatePaymentMethod(editingMethod.id, newMethodName.trim());
    setNewMethodName('');
    setEditingMethod(null);
    setShowEditMethod(false);
    console.log('Payment method updated:', newMethodName.trim());
  };

  const handleDeleteMethod = (id: string, name: string) => {
    Alert.alert(
      'Delete Payment Method',
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deletePaymentMethod(id);
            console.log('Payment method deleted:', name);
          },
        },
      ]
    );
  };

  const styles = getStyles(colors);

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[commonStyles.title, styles.title]}>Payment Methods</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddMethod(true)}
          >
            <Icon name="add" size={24} color={colors.background} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={commonStyles.textSecondary}>
            Manage the payment methods available for player payments. You can add, edit, or delete payment methods as needed.
          </Text>

          <View style={styles.section}>
            <Text style={commonStyles.subtitle}>Available Methods ({paymentMethods.length})</Text>
            
            {paymentMethods.map((method) => (
              <View key={method.id} style={styles.methodCard}>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.methodActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditMethod(method.id, method.name)}
                  >
                    <Icon name="pencil" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  
                  {!method.isDefault && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteMethod(method.id, method.name)}
                    >
                      <Icon name="trash" size={16} color={colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            {paymentMethods.length === 0 && (
              <View style={styles.emptyState}>
                <Icon name="card" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.text, styles.emptyText]}>
                  No payment methods configured yet
                </Text>
                <TouchableOpacity
                  style={[buttonStyles.primary, styles.addFirstMethodButton]}
                  onPress={() => setShowAddMethod(true)}
                >
                  <Text style={[commonStyles.text, { color: colors.background }]}>
                    Add First Method
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={commonStyles.subtitle}>Quick Actions</Text>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => setShowAddMethod(true)}
            >
              <Icon name="add-circle" size={32} color={colors.primary} />
              <Text style={styles.actionTitle}>Add New Method</Text>
              <Text style={styles.actionSubtitle}>Create a new payment method option</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Add Method Modal */}
      <CenterModal
        isVisible={showAddMethod}
        onClose={() => {
          setShowAddMethod(false);
          setNewMethodName('');
        }}
      >
        <View style={styles.modalContent}>
          <Text style={commonStyles.subtitle}>Add Payment Method</Text>
          
          <Text style={commonStyles.inputLabel}>Method Name</Text>
          <TextInput
            style={commonStyles.input}
            value={newMethodName}
            onChangeText={setNewMethodName}
            placeholder="e.g., Venmo, PayPal, Check"
            placeholderTextColor={colors.textSecondary}
            autoFocus
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[buttonStyles.secondary, styles.button]}
              onPress={() => {
                setShowAddMethod(false);
                setNewMethodName('');
              }}
            >
              <Text style={[commonStyles.text, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[buttonStyles.primary, styles.button]}
              onPress={handleAddMethod}
            >
              <Text style={[commonStyles.text, { color: colors.background }]}>Add Method</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CenterModal>

      {/* Edit Method Modal */}
      <CenterModal
        isVisible={showEditMethod}
        onClose={() => {
          setShowEditMethod(false);
          setNewMethodName('');
          setEditingMethod(null);
        }}
      >
        <View style={styles.modalContent}>
          <Text style={commonStyles.subtitle}>Edit Payment Method</Text>
          
          <Text style={commonStyles.inputLabel}>Method Name</Text>
          <TextInput
            style={commonStyles.input}
            value={newMethodName}
            onChangeText={setNewMethodName}
            placeholder="Enter method name"
            placeholderTextColor={colors.textSecondary}
            autoFocus
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[buttonStyles.secondary, styles.button]}
              onPress={() => {
                setShowEditMethod(false);
                setNewMethodName('');
                setEditingMethod(null);
              }}
            >
              <Text style={[commonStyles.text, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[buttonStyles.primary, styles.button]}
              onPress={handleUpdateMethod}
            >
              <Text style={[commonStyles.text, { color: colors.background }]}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CenterModal>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginTop: 24,
    marginBottom: 24,
  },
  methodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  methodInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  defaultBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
  methodActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  addFirstMethodButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  actionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalContent: {
    padding: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
});
