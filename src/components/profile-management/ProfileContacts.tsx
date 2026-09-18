import type { ContactType, ProfileContact, ProfileContactCreate, ProfileContactUpdate } from '../../types/profile';
import styles from '../../styles/ProfileManagementPage.module.css'
import { useState, useEffect, useRef } from 'react';
import { createProfileContact, deleteProfileContact, reorderProfileContacts, updateProfileContact } from '../../api/profileApi';

import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableContactCard from './SortableContactCard';

type ProfileContactsProps = {
    contacts: ProfileContact[];
    loadProfile: () => Promise<void>;
    profileId: string;
    setSuccessMessage: (message: string) => void;
    setError: (message: string) => void;
}

const CONTACT_TYPE_OPTIONS: { value: ContactType; label: string }[] = [
    { value: "phone", label: "Phone" },
    { value: "email", label: "Email" },
];

// curated common regions -- phone validation needs a region, but it isn't
// persisted, so this is only ever used to normalize the value being submitted
const REGION_OPTIONS = [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
    { code: "AU", name: "Australia" },
    { code: "NZ", name: "New Zealand" },
    { code: "IE", name: "Ireland" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "ES", name: "Spain" },
    { code: "IT", name: "Italy" },
    { code: "NL", name: "Netherlands" },
    { code: "MX", name: "Mexico" },
    { code: "BR", name: "Brazil" },
    { code: "IN", name: "India" },
    { code: "JP", name: "Japan" },
    { code: "CN", name: "China" },
    { code: "SG", name: "Singapore" },
    { code: "ZA", name: "South Africa" },
];

const DEFAULT_REGION = "US";

type NewContactState = {
    contact_type: ContactType;
    region: string;
    label: string;
    value: string;
};

const DEFAULT_NEW_CONTACT: NewContactState = {
    contact_type: "phone",
    region: DEFAULT_REGION,
    label: "",
    value: "",
};

type EditContactState = {
    contact_id: string;
    contact_type: ContactType;
    region: string;
    label: string;
    value: string;
};

export default function ProfileContacts({ contacts, profileId, loadProfile, setSuccessMessage, setError }: ProfileContactsProps) {

    const [contactToDelete, setContactToDelete] = useState<string | null>(null);
    const [showAddContactModal, setShowAddContactModal] = useState(false);
    const [editingContact, setEditingContact] = useState<EditContactState | null>(null);
    const [newContact, setNewContact] = useState<NewContactState>(DEFAULT_NEW_CONTACT);
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [orderedContacts, setOrderedContacts] = useState<ProfileContact[]>(contacts);
    const [prevContacts, setPrevContacts] = useState(contacts);

    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    if (contacts !== prevContacts) {
        setPrevContacts(contacts);
        setOrderedContacts(contacts);
    }

    useEffect(() => {
        const modalIsOpen = showAddContactModal || editingContact !== null || contactToDelete !== null;

        if (!modalIsOpen) return;

        cancelButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;

            if (contactToDelete)
                setContactToDelete(null);

            if (editingContact)
                setEditingContact(null);

            if (showAddContactModal) {
                setShowAddContactModal(false);
                setNewContact(DEFAULT_NEW_CONTACT);
            }

            setFormError("");
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [showAddContactModal, editingContact, contactToDelete]);

    async function handleAddContact() {
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (!newContact.value.trim()) {
            setFormError(newContact.contact_type === "phone" ? "Phone number cannot be empty" : "Email cannot be empty");
            setIsSubmitting(false);
            return;
        }

        const contactToCreate: ProfileContactCreate = {
            contact_type: newContact.contact_type,
            value: newContact.value.trim(),
            label: newContact.label.trim() || undefined,
            region: newContact.contact_type === "phone" ? newContact.region : undefined,
        };

        try {
            setFormError("");

            await createProfileContact(profileId, contactToCreate);

            setShowAddContactModal(false);
            setNewContact(DEFAULT_NEW_CONTACT);
            setIsSubmitting(false);

            await loadProfile();

            setSuccessMessage("Contact added successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Failed to add contact");
            setIsSubmitting(false);
        }
    }

    async function handleEditContact() {
        if (isSubmitting || !editingContact) return;
        setIsSubmitting(true);

        if (!editingContact.value.trim()) {
            setFormError(editingContact.contact_type === "phone" ? "Phone number cannot be empty" : "Email cannot be empty");
            setIsSubmitting(false);
            return;
        }

        const updateData: ProfileContactUpdate = {
            label: editingContact.label.trim() || undefined,
            value: editingContact.value.trim(),
            region: editingContact.contact_type === "phone" ? editingContact.region : undefined,
        };

        try {
            setFormError("");

            await updateProfileContact(editingContact.contact_id, updateData);

            setEditingContact(null);
            setIsSubmitting(false);

            await loadProfile();

            setSuccessMessage("Contact updated successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Failed to update contact");
            setIsSubmitting(false);
        }
    }

    async function handleSetPrimary(contactId: string) {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            await updateProfileContact(contactId, { is_primary: true });
            await loadProfile();

            setSuccessMessage("Primary contact updated");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update primary contact");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDeleteContact(contactId: string) {
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (!contactToDelete) return;

        try {
            await deleteProfileContact(contactId);
            await loadProfile();

            setContactToDelete(null);
            setIsSubmitting(false);
            setSuccessMessage("Contact deleted successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete contact");
            setIsSubmitting(false);
        }
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = orderedContacts.findIndex(contact => contact.contact_id === active.id);
        const newIndex = orderedContacts.findIndex(contact => contact.contact_id === over.id);

        const reorderedContacts = arrayMove(orderedContacts, oldIndex, newIndex);

        const previousContacts = orderedContacts;
        setOrderedContacts(reorderedContacts);

        try {
            await reorderProfileContacts(
                reorderedContacts.map((contact, index) => ({
                    contact_id: contact.contact_id,
                    display_order: index,
                }))
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to reorder contacts");
            setOrderedContacts(previousContacts);
        }
    }

    function openEditModal(contact: ProfileContact) {
        setEditingContact({
            contact_id: contact.contact_id,
            contact_type: contact.contact_type,
            region: DEFAULT_REGION,
            label: contact.label ?? "",
            value: contact.value,
        });
    }

    return (
        <>
            <section className={styles.itemPanel}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h2>Contact Info - {orderedContacts.length}</h2>
                        <p>
                            Manage the contact information shown on the public profile.
                        </p>
                    </div>

                    <button
                        className={styles.primaryButton}
                        disabled={isSubmitting}
                        onClick={() => setShowAddContactModal(true)}
                    >
                        + Add Contact
                    </button>
                </div>

                {orderedContacts.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h3>No contact info added yet</h3>
                        <p>Add a phone number or email so people can reach you.</p>
                    </div>
                ) : (
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext
                            items={orderedContacts.map(contact => contact.contact_id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className={styles.itemList}>
                                {orderedContacts.map(contact => (
                                    <SortableContactCard
                                        key={contact.contact_id}
                                        contact={contact}
                                        isSubmitting={isSubmitting}
                                        onDelete={() => setContactToDelete(contact.contact_id)}
                                        onEdit={openEditModal}
                                        onSetPrimary={handleSetPrimary}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </section>

            {showAddContactModal && (
                <div className={styles.modalBackdrop}>
                    <div
                        className={styles.confirmModal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="add-contact-modal-title"
                    >
                        <h2 id="add-contact-modal-title">Add Contact Info</h2>

                        {formError && <p className={styles.formError}>{formError}</p>}

                        <select
                            className={styles.modalSelect}
                            aria-label="Contact type"
                            value={newContact.contact_type}
                            onChange={(e) => setNewContact({ ...newContact, contact_type: e.target.value as ContactType })}
                        >
                            {CONTACT_TYPE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {newContact.contact_type === "phone" && (
                            <select
                                className={styles.modalSelect}
                                aria-label="Region"
                                value={newContact.region}
                                onChange={(e) => setNewContact({ ...newContact, region: e.target.value })}
                            >
                                {REGION_OPTIONS.map((region) => (
                                    <option key={region.code} value={region.code}>
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        <input
                            type={newContact.contact_type === "phone" ? "tel" : "email"}
                            aria-label={newContact.contact_type === "phone" ? "Phone number" : "Email address"}
                            placeholder={newContact.contact_type === "phone" ? "Phone number" : "Email address"}
                            value={newContact.value}
                            onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                        />

                        <input
                            type="text"
                            aria-label="Contact label"
                            placeholder="Label (optional, e.g. Work, Personal)"
                            value={newContact.label}
                            onChange={(e) => setNewContact({ ...newContact, label: e.target.value })}
                        />

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                ref={cancelButtonRef}
                                className={styles.cancelButton}
                                disabled={isSubmitting}
                                onClick={() => {
                                    setShowAddContactModal(false);
                                    setNewContact(DEFAULT_NEW_CONTACT);
                                    setFormError("");
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className={styles.saveButton}
                                disabled={isSubmitting}
                                onClick={handleAddContact}
                            >
                                Save Contact
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editingContact && (
                <div className={styles.modalBackdrop}>
                    <div
                        className={styles.confirmModal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-contact-modal-title"
                    >
                        <h2 id="edit-contact-modal-title">
                            Edit {editingContact.contact_type === "phone" ? "Phone" : "Email"} Contact
                        </h2>

                        {formError && <p className={styles.formError}>{formError}</p>}

                        {editingContact.contact_type === "phone" && (
                            <select
                                className={styles.modalSelect}
                                aria-label="Region"
                                value={editingContact.region}
                                onChange={(e) => setEditingContact({ ...editingContact, region: e.target.value })}
                            >
                                {REGION_OPTIONS.map((region) => (
                                    <option key={region.code} value={region.code}>
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        <input
                            type={editingContact.contact_type === "phone" ? "tel" : "email"}
                            aria-label={editingContact.contact_type === "phone" ? "Phone number" : "Email address"}
                            placeholder={editingContact.contact_type === "phone" ? "Phone number" : "Email address"}
                            value={editingContact.value}
                            onChange={(e) => setEditingContact({ ...editingContact, value: e.target.value })}
                        />

                        <input
                            type="text"
                            aria-label="Contact label"
                            placeholder="Label (optional, e.g. Work, Personal)"
                            value={editingContact.label}
                            onChange={(e) => setEditingContact({ ...editingContact, label: e.target.value })}
                        />

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                ref={cancelButtonRef}
                                className={styles.cancelButton}
                                disabled={isSubmitting}
                                onClick={() => {
                                    setEditingContact(null);
                                    setFormError("");
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className={styles.saveButton}
                                disabled={isSubmitting}
                                onClick={handleEditContact}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {contactToDelete && (
                <div className={styles.modalBackdrop}>
                    <div
                        className={styles.confirmModal}
                        role="dialog" aria-modal="true"
                        aria-labelledby="delete-contact-modal-title"
                    >
                        <h2 id="delete-contact-modal-title">Delete contact?</h2>
                        <p>Are you sure you want to delete this contact? This action cannot be undone.</p>

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                ref={cancelButtonRef}
                                className={styles.cancelButton}
                                disabled={isSubmitting}
                                onClick={() => setContactToDelete(null)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className={styles.deleteConfirmButton}
                                disabled={isSubmitting}
                                onClick={() => handleDeleteContact(contactToDelete)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
