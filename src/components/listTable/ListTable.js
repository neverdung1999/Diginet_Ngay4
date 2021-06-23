import React, { useState, useEffect } from "react";
import _ from "lodash";
import "./listTable.css";
import "devextreme-react/text-area";
import { connect } from "react-redux";
import * as actions from "../../redux/actions";
import AboutTable from "../aboutTable/AboutTable";
import GlobalLoading from "../animation/globalLoading/GlobalLoading";
import DataGrid, {
  Column,
  Editing,
  Button as ButtonDev,
  Paging,
} from "devextreme-react/data-grid";
import {
  Typography,
  Button,
  PagingInfo,
  Alert,
  Popup,
  Modal,
  ModalHeader,
  ModalBody,
} from "diginet-core-ui/components";
import { Edit, Delete } from "diginet-core-ui/icons";

function ListTable(props) {
  const { getDataRequest, dataRequest } = props;
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [isRender, setIsRender] = useState(true);
  const [dataTemp, setDataTemp] = useState(null);
  const [dataDelete, setDataDelete] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [openFormAbout, setOpenFormAbout] = useState(false);
  const [showLoadingNoti, setShowLoadingNoti] = useState(false);

  const [valueNotification, setValueNotification] = useState({
    color: null,
    text: null,
  });

  useEffect(() => {
    isRender && getDataRequest(setShowLoading);
    setIsRender(false);
    !_.isEmpty(dataRequest) ? setData(dataRequest) : setData([]);
  }, [getDataRequest, dataRequest, isRender]);

  const countIndex = (e) => {
    return data.indexOf(e) + 1;
  };

  const onOpenAbout = () => {
    setOpenFormAbout(true);
  };

  const onCloseForm = (e) => {
    setOpenFormAbout(e);
    setDataTemp(null);
  };

  const onChangesChange = (e) => {
    switch (e[0]?.type) {
      case "update":
        e.length !== 0 && props.updateData(e[0], setShowLoading);
        return;
      case "remove":
        e.length !== 0 &&
          props.deleteData(
            e[0]?.key,
            setShowLoading,
            setValueNotification,
            setShowLoadingNoti
          );
        return;
      default:
        return;
    }
  };

  const updateItem = (e) => {
    setOpenFormAbout(true);
    setDataTemp(e);
  };

  const onDeleteItem = (e) => {
    const id = dataDelete?.id;
    props.deleteData(
      id,
      setShowLoading,
      setValueNotification,
      setShowLoadingNoti
    );
    setPopUpDelete(false);
  };

  const test = (e, index) => {
    return index === 1 ? (
      <div
        style={{ cursor: "pointer", marginRight: "15px" }}
        onClick={() => updateItem(e.data)}
      >
        <Edit />
      </div>
    ) : (
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          setPopUpDelete(true);
          setDataDelete(e.data);
        }}
      >
        <Delete />
      </div>
    );
  };

  return (
    <div>
      <GlobalLoading showLoading={showLoading} />
      <AboutTable
        openFormAbout={openFormAbout}
        onCloseForm={onCloseForm}
        dataTemp={dataTemp}
      />
      <div
        className="loading_notification"
        style={
          showLoadingNoti
            ? { transition: ".5s", opacity: 1 }
            : { transition: "2s", opacity: 0 }
        }
      >
        {showLoadingNoti && (
          <Alert
            autoDisappear
            color={valueNotification.color}
            progressing
            size="medium"
            text={valueNotification.text}
            vertical="bottom"
          />
        )}
        <Popup
          fullScreen
          icon="danger"
          onCancel={function noRefCheck() {
            setPopUpDelete(false);
          }}
          onClose={function noRefCheck() {
            setPopUpDelete(false);
          }}
          onConfirm={onDeleteItem}
          pressESCToClose
          title="Bạn có chắc chắn muốn xóa?"
          type="yes-no"
          open={popUpDelete}
        />
      </div>
      <div className="backgroundListTable">
        <div className="backgroundListTable_top">
          <Typography
            type="h2"
            uppercase={true}
            color="primary"
            required
            className="TitleList"
          >
            Danh sách bảng mục tiêu
          </Typography>
          <Button
            style={{ marginLeft: 20 }}
            color="primary"
            text="Thêm"
            viewType="filled"
            startIcon="add"
            id="top_left-btnAdd"
            onClick={() => onOpenAbout()}
          />
        </div>
        <div className="backgroundListTable_bottom">
          <div className="dataGrid_form">
            <DataGrid
              dataSource={_.uniq(data)}
              keyExpr="id"
              showBorders={true}
              className="dataGrid"
            >
              <Editing
                allowUpdating
                allowDeleting
                useIcons={true}
                onChangesChange={onChangesChange}
              />
              <Column
                dataField="id"
                calculateCellValue={(e) => countIndex(e)}
                caption="Stt"
                width={50}
              />
              <Column dataField="name" />
              <Column dataField="description" caption="Mô tả" />
              <Column
                dataField="time"
                caption="Khoảng thời gian"
                dataType="date"
                format="dd/MM/yyyy"
              />
              <Column
                dataField="priority"
                caption="Độ ưu tiên"
                // width={125}
              ></Column>
              <Column caption="Chức năng" type="buttons">
                <ButtonDev render={(e) => test(e, 1)} />
                <ButtonDev render={(e) => test(e, 2)} />
              </Column>
              <Paging defaultPageSize={10} style={{ display: "none" }} />
              <Paging
                pageIndex={pageIndex}
                pageSize={pageSize}
                style={{ display: "none" }}
              />
            </DataGrid>
          </div>
          <div className="paging">
            <PagingInfo
              itemsPerPage={10}
              listItemsPerPage={[10, 20, 40, 50]}
              onChangePage={(data) => setPageIndex(data - 1)}
              onChangeItemsPerPage={(value) => setPageSize(value)}
              totalItems={data.length}
            />
          </div>
        </div>
      </div>
      <Modal
        darkTheme={false}
        onClose={function noRefCheck() {}}
        style={{ height: 375, boxShadow: "0px 5px 5px 5px" }}
      >
        <ModalHeader style={{ height: "15%", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              type="h1"
              uppercase={true}
              color="rgb(17, 29, 94)"
              required
            >
              Danh sách bảng mục tiêu
            </Typography>
            <Button
              style={{ marginLeft: 20 }}
              color="primary"
              text="Thêm"
              viewType="filled"
              startIcon="add"
              id="top_left-btnAdd"
              onClick={() => onOpenAbout()}
            />
          </div>
        </ModalHeader>
        <ModalBody style={{ height: "85%" }}>
          <div className="background_form-bottom">
            <DataGrid
              dataSource={_.uniq(data)}
              keyExpr="id"
              showBorders={true}
              className="dataGrid"
            >
              <Editing
                allowUpdating
                allowDeleting
                useIcons={true}
                onChangesChange={onChangesChange}
              />
              <Column
                dataField="id"
                calculateCellValue={(e) => countIndex(e)}
                caption="Stt"
                width={50}
              />
              <Column dataField="name" />
              <Column dataField="description" caption="Mô tả" />
              <Column
                dataField="time"
                caption="Khoảng thời gian"
                dataType="date"
                format="dd/MM/yyyy"
              />
              <Column
                dataField="priority"
                caption="Độ ưu tiên"
                // width={125}
              ></Column>
              <Column caption="Chức năng" type="buttons">
                <ButtonDev render={(e) => test(e, 1)} />
                <ButtonDev render={(e) => test(e, 2)} />
              </Column>
              <Paging defaultPageSize={10} style={{ display: "none" }} />
              <Paging
                pageIndex={pageIndex}
                pageSize={pageSize}
                style={{ display: "none" }}
              />
            </DataGrid>
            <PagingInfo
              itemsPerPage={10}
              listItemsPerPage={[10, 20, 40, 50]}
              onChangePage={(data) => setPageIndex(data - 1)}
              onChangeItemsPerPage={(value) => setPageSize(value)}
              totalItems={data.length}
            />
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    dataRequest: state.ListData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDataRequest: (setShowLoading) =>
      dispatch(actions.getData(setShowLoading)),
    deleteData: (
      id,
      setShowLoading,
      setValueNotification,
      setShowLoadingNoti
    ) =>
      dispatch(
        actions.deleteData(
          id,
          setShowLoading,
          setValueNotification,
          setShowLoadingNoti
        )
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListTable);
