import { useState, useCallback } from "react";

export const useModal = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState(undefined);

  const closeModal = () =>
    Promise.resolve().then(() => {
      setModalVisible(false);
      setInitialValues(undefined);
    });
  
  const openModal = useCallback((initialValues = undefined) => {
    if (initialValues) setInitialValues(initialValues);
    setModalVisible(true);
  }, []);

  return {
    modalVisible, initialValues, openModal, closeModal
  }
};
