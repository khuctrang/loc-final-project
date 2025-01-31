import { useCallback, useEffect, useState } from 'react';
import { Button } from '@ahaui/react';
import { createItem, editItem, fetchItemList, removeItem } from 'redux/actions/item';
import { userSelector } from 'redux/reducers/user.';
import { setModal } from 'redux/actions/modal';
import { setBreadcrumb } from 'redux/actions/breadcrumb';
import { breadcrumbSelector } from 'redux/reducers/breadcrumb';
import { fetchCategoryDetail } from 'redux/actions/category';
import { IFormItemInputs } from 'types/form';
import {
  useAppSelector,
  useAuthorWarning,
  useAuthWarning,
  useCloseModal,
  useCreate,
  useTypedDispatch,
} from 'hooks';
import { ModalList } from 'constants/modal';
import useEdit from 'hooks/useEdit';
import useDelete from 'hooks/useDelete';
import useParamsNum from 'hooks/useParamsNum';
import { PageWithTable } from 'components/Common';
import ItemsTable from 'components/Items/ItemsTable';
import { ItemsDataType, ItemType } from './ItemsType';

const Items = () => {
  const user = useAppSelector(userSelector);
  const breadcrumb = useAppSelector(breadcrumbSelector);
  const [data, setData] = useState<ItemsDataType>({
    total: 0,
    items: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { categoryId } = useParamsNum('categoryId');
  const dispatch = useTypedDispatch();
  const closeModalHandle = useCloseModal();
  const handleUserNotLoggedIn = useAuthWarning();
  const handleUserIsNotAuthor = useAuthorWarning();

  const fetchData = useCallback(
    (pageNumber: number) => fetchItemList(categoryId, pageNumber),
    [categoryId],
  );

  const submitCreateHandle = useCreate(data, setData, (formData) =>
    createItem(+categoryId, formData));

  const submitEditHandle = useEdit(data, setData, (id, formData) => editItem(id, formData));

  const submitDeleteHandle = useDelete(
    data,
    setData,
    setIsLoading,
    (id) => removeItem(id),
    (pageNumber) => fetchItemList(categoryId, pageNumber),
  );

  const createItemOnClick = () => {
    if (!user.isLoggedIn) {
      handleUserNotLoggedIn('create item', 'create');
      return;
    }

    dispatch(
      setModal({
        component: ModalList.CREATE_ITEM,
        componentProps: {
          submitHandle: submitCreateHandle,
          closeHandle: closeModalHandle,
        },
        isLoading: false,
        isOpen: true,
        title: 'Create item form',
        closeHandle: closeModalHandle,
        footerContent: undefined,
      }),
    );
  };

  const editIconOnClick = (id: number) => {
    if (!user.isLoggedIn) {
      handleUserNotLoggedIn('edit item', 'edit', id);
      return;
    }

    const toBeEditItem = data.items.find((item) => item.id === id);

    if (toBeEditItem) {
      if (user.id && Number(user.id) !== toBeEditItem.creatorId) {
        handleUserIsNotAuthor(`item ${toBeEditItem.id}`);
        return;
      }

      dispatch(
        setModal({
          component: ModalList.EDIT_ITEM,
          componentProps: {
            submitHandle: (formData: IFormItemInputs) => submitEditHandle(id, formData),
            closeHandle: closeModalHandle,
            initValue: toBeEditItem,
          },
          isLoading: false,
          isOpen: true,
          title: 'Edit item form',
          closeHandle: closeModalHandle,
          footerContent: undefined,
        }),
      );
    }
  };

  const removeIconOnClick = (id: number) => {
    if (!user.isLoggedIn) {
      handleUserNotLoggedIn('delete item', 'delete', id);
      return;
    }

    const toBeDeleteItem = data.items.find((item) => item.id === id);

    if (toBeDeleteItem) {
      if (toBeDeleteItem) {
        if (user.id && Number(user.id) !== toBeDeleteItem.creatorId) {
          handleUserIsNotAuthor(`item ${toBeDeleteItem.id}`);
          return;
        }
      }
      dispatch(
        setModal({
          component: ModalList.DELETE_WARNING,
          componentProps: { itemName: `item ${toBeDeleteItem.id}` },
          isLoading: false,
          isOpen: true,
          title: 'Delete Warning',
          closeHandle: closeModalHandle,
          footerContent: {
            closeButtonContent: 'Cancel',
            submitButtonContent: 'Confirm',
            closeButtonHandle: () => closeModalHandle(),
            submitButtonHandle: () => {
              submitDeleteHandle(id);
            },
          },
        }),
      );
    }
  };

  const renderTable = (list: Array<ItemType>) => {
    if (categoryId) {
      return (
        <ItemsTable
          categoryId={categoryId}
          list={list}
          removeHandle={removeIconOnClick}
          editHandle={editIconOnClick}
        />
      );
    }
    return null;
  };

  useEffect(() => {
    if (breadcrumb.length === 0) {
      dispatch(fetchCategoryDetail(+categoryId)).then((category) => {
        const newBreadcrumb = [
          {
            title: 'Manage Category',
            href: '/categories',
          },
          {
            title: category.name,
            href: `/categories/${category.id}/items`,
          },
        ];

        dispatch(setBreadcrumb(newBreadcrumb));
      });
    }
  }, [breadcrumb.length, categoryId, dispatch]);

  return (
    <div>
      <PageWithTable
        data={data}
        setData={setData}
        renderTable={renderTable}
        // breadcrumb={
        //   !categoryLoading ? (
        //     `Manage Category > ${category ? category.name : 'undefined'}`
        //   ) : (
        //     <Skeleton width="400px" height="30px" />
        //   )
        // }
        tableTitle="Item list"
        fetchData={fetchData}
        CreateButton={<Button onClick={createItemOnClick}>Create item</Button>}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        createButtonClick={createItemOnClick}
        editIconClick={editIconOnClick}
        removeIconClick={removeIconOnClick}
      />
    </div>
  );
};

export default Items;
