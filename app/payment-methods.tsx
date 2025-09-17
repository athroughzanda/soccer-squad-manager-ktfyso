
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { useTeamData } from '../hooks/useTeamData';
import Icon from '../components/Icon';
import SimpleBottomSheet from '../components/BottomSheet';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = useTeamData();
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [editingMethod, setEditingMethod] = useState<{ id: string; name: string } | null>(null);
  const [newMethodName, setNewMethodName] = useState('');

  const handleAddMethod = () => {
    if (!newMethodName.trim()) {
      Alert.alert('Error', 'Please enter a payment method name');
      return;
    }
    
    addPaymentMethod(newMethodName.trim());
    setNewMethodName('');
    setShowAddMethod(false);
  };

  const handleEditMethod = (id: string, currentName: string) => {
    setEditingMethod({ id, name: currentName });
  };

  const handleUpdateMethod = () => {
    if (!editingMethod || !editingMethod.name.trim()) {
      Alert.alert('Error', 'Please enter a valid name');
      return;
    }
    
    updatePaymentMethod(editingMethod.id, editingMethod.name.trim());
    setEditingMethod(null);
  };

  const handleDeleteMethod = (id: string, name: string) => {
    Alert.alert(
      'Delete Payment Method',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const success = deletePaymentMethod(id);
            if (!success) {
              Alert.alert('Error', 'Cannot delete default payment methods');
            }
          },
        },
      ]
    );
  };

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
          <View style={styles.section}>
            <Text style={commonStyles.subtitle}>Available Payment Methods</Text>
            
            {paymentMethods.map((method) => (
              <View key={method.id} style={styles.methodCard}>
                {editingMethod?.id === method.id ? (
                  <View style={styles.editContainer}>
                    <TextInput
                      style={[commonStyles.input, styles.editInput]}
                      value={editingMethod.name}
                      onChangeText={(text) => setEditingMethod({ ...editingMethod, name: text })}
                      placeholder="Payment method name"
                      placeholderTextColor={colors.textSecondary}
                    />
                    <View style={styles.editActions}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => setEditingMethod(null)}
                      >
                        <Icon name="close" size={16} color={colors.text} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.saveButton]}
                        onPress={handleUpdateMethod}
                      >
                        <Icon name="checkmark" size={16} color={colors.background} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.methodInfo}>
                    <View style={styles.methodDetails}>
                      <Text style={styles.methodName}>{method.name}</Text>
                      {method.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultText}>Default</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.methodActions}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => handleEditMethod(method.id, method.name)}
                      >
                        <Icon name="pencil" size={16} color={colors.primary} />
                      </TouchableOpacity>
                      
                      {!method.isDefault && (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.deleteButton]}
                          onPress={() => handleDeleteMethod(method.id, method.name)}
                        >
                          <Icon name="trash" size={16} color={colors.error} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>
            ))}
            
            {paymentMethods.length === 0 && (
              <View style={styles.emptyState}>
                <Icon name="card" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.text, styles.emptyText]}>
                  No payment methods configured
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={commonStyles.subtitle}>Information</Text>
            <View style={commonStyles.card}>
              <Text style={styles.infoText}>
                • Default payment methods cannot be deleted
              </Text>
              <Text style={styles.infoText}>
                • Custom payment methods can be edited or removed
              </Text>
              <Text style={styles.infoText}>
                • Players can use any configured payment method
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <SimpleBottomSheet
        isVisible={showAddMethod}
        onClose={() => setShowAddMethod(false)}
      >
        <View style={styles.addMethodForm}>
          <Text style={commonStyles.subtitle}>Add Payment Method</Text>
          
          <Text style={commonStyles.inputLabel}>Method Name</Text>
          <TextInput
            style={commonStyles.input}
            value={newMethodName}
            onChangeText={setNewMethodName}
            placeholder="e.g., Venmo, PayPal, Check"
            placeholderTextColor={colors.textSecondary}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[buttonStyles.secondary, styles.button]}
              onPress={() => setShowAddMethod(false)}
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
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 4,
  },
  section: {
    marginBottom: 24,
  },
  methodCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  methodInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodDetails: {
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
  defaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
  methodActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: colors.backgroundAlt,
  },
  deleteButton: {
    backgroundColor: colors.backgroundAlt,
  },
  saveButton: {
    backgroundColor: colors.success,
  },
  cancelButton: {
    backgroundColor: colors.backgroundAlt,
  },
  editContainer: {
    gap: 12,
  },
  editInput: {
    marginBottom: 0,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  addMethodForm: {
    padding: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
  },
});
