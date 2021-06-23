/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from "react";
import "./aboutTable.css";
import {
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  DatePicker,
  Toggle,
  Dropdown,
  NumberInput,
  TextInput,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "diginet-core-ui/components";
import { connect } from "react-redux";
import * as actions from "../../redux/actions";
import GlobalLoading from "../animation/globalLoading/GlobalLoading";
import value from "../../constantValue";
import _ from "lodash";

function AboutTable(props) {
  const { openFormAbout, dataTemp } = props;
  const [showLoading, setShowLoading] = useState(false);
  const [showLoadingNoti, setShowLoadingNoti] = useState(false);
  const [openReviewTarget, setOpenReviewTarget] = useState(false);
  const [openApprovalTarget, setOpenApprovalTarget] = useState(false);

  const [err, setErr] = useState({
    name: "",
    dateStart: "",
    dateEnd: "",
    priority: "",
  });
  const [valueInput, setValueInput] = useState(value);
  const [valueNotification, setValueNotification] = useState({
    color: null,
    text: null,
  });

  useEffect(() => {
    const objectTemp = {};
    if (dataTemp !== null) {
      for (const [key, value] of Object.entries(dataTemp)) {
        objectTemp[key] = value;
      }
      setValueInput(objectTemp);
      setOpenReviewTarget(dataTemp?.reviewTarget);
      setOpenApprovalTarget(dataTemp?.approvalTarget);
    } else {
      setValueInput(value);
    }
  }, [dataTemp]);

  const onCloseForm = () => {
    props.onCloseForm();
    setErr({
      name: "",
      dateStart: "",
      dateEnd: "",
    });
  };

  const handleChange = (value, name) => {
    setValueInput({
      ...valueInput,
      [name]: value,
    });
    switch (name) {
      case "name":
        value === "" && setErr({ ...err, name: true });
        return;
      case "dateStart":
        value && setErr({ ...err, dateStart: "Vui lòng nhập thông tin" });
        return;
      case "dateEnd":
        value && setErr({ ...err, dateEnd: "Vui lòng nhập thông tin" });
        return;
      case "reviewTarget":
        setOpenReviewTarget(value);
        return;
      case "approvalTarget":
        setOpenApprovalTarget(value);
        return;
      default:
        return;
    }
  };

  const handleSubmit = (e) => {
    const objectTemp = { ...err };
    const valueTemp = { ...valueInput };

    Object.keys(err).forEach((item) => {
      if (valueInput[item] === "") {
        if (item === "name") {
          objectTemp[item] = "Vui lòng nhập thông tin";
        }
      } else {
        objectTemp[item] = "";
      }
      if (valueInput[item] === null) {
        if (item === "dateStart" || item === "dateEnd") {
          objectTemp[item] = "Vui lòng nhập thông tin";
        }
      }
    });
    setErr(objectTemp);

    if (
      objectTemp.name === "" &&
      objectTemp.dateStart === "" &&
      objectTemp.dateEnd === ""
    ) {
      //xu ly submit valueInput

      setShowLoading(true);
      if (!openReviewTarget) {
        valueTemp.numberReview = "1";
        valueTemp.dateReviewEnd = null;
        valueTemp.actCopyResults = false;
        valueTemp.inputLabel1 = "";
        valueTemp.inputLabel2 = "";
        valueTemp.inputLabel3 = "";
      }
      if (!openApprovalTarget) {
        valueTemp.dateStartApproval = null;
      }
      if (valueInput?.priority < 0) {
        valueTemp.priority = 0;
      }
      if (!dataTemp) {
        props.addDataRequest(
          valueTemp,
          setShowLoading,
          setValueNotification,
          setShowLoadingNoti
        );

        setValueInput(value);
      } else {
        props.updateData(
          valueTemp,
          dataTemp.id,
          setShowLoading,
          setValueNotification,
          setShowLoadingNoti
        );
      }
      props.onCloseForm();
    } else {
      setShowLoadingNoti(true);
      setTimeout(() => {
        setShowLoadingNoti(false);
      }, 5000);
      setValueNotification({
        text: "Thêm dữ liệu thất bại, vui lòng nhập đầy đủ thông tin",
        color: "danger",
      });
    }
  };

  return (
    <div>
      <GlobalLoading showLoading={showLoading} />
      <Modal
        onClose={() => onCloseForm()}
        open={openFormAbout}
        style={{ width: 690, height: 800, minWidth: "300px" }}
      >
        <ModalHeader style={{ width: "100%", height: "8%" }}>
          <Typography color="primary" type="title4">
            Thông tin bảng mục tiêu
          </Typography>
        </ModalHeader>
        <ModalBody style={{ width: "100%", height: "84%" }}>
          <div className="backgroundAbout_form-body">
            <div className="formAbout_body-backgroundAll">
              <div className="formAbout_body-item">
                <div className="bodyAbout_item-bottom">
                  <TextInput
                    label="Tên bảng mục tiêu"
                    required
                    type="text"
                    onChange={(e) => handleChange(e.target.value, "name")}
                    error={err.name}
                    placeholder="Nhập"
                    value={valueInput.name}
                  />
                </div>
              </div>
              <div className="formAbout_body-item">
                <div className="bodyAbout_item-bottom">
                  <TextInput
                    label="Mô tả"
                    type="text"
                    placeholder="Nhập"
                    onChange={(e) =>
                      handleChange(e.target.value, "description")
                    }
                    value={valueInput.description}
                  />
                </div>
              </div>
              <div className="formAbout_calendar">
                <div
                  className="formAbout_calendar-item"
                  style={{ marginTop: 10 }}
                >
                  <div className="calendar_item-input">
                    <DatePicker
                      displayFormat="DD/MM/YYYY"
                      returnFormat="MM/DD/YYYY"
                      placeholder="dd/mm/yyyy"
                      label="Ngày bắt đầu"
                      onChange={(e) => handleChange(e.value, "dateStart")}
                      max={valueInput.dateEnd}
                      error={err.dateStart}
                      value={valueInput.dateStart}
                      required
                      clearAble
                      className="dateTimePicker"
                    ></DatePicker>
                  </div>
                </div>
                <div
                  className="formAbout_calendar-item"
                  style={{ marginTop: 10 }}
                >
                  <div className="calendar_item-input">
                    <DatePicker
                      displayFormat="DD/MM/YYYY"
                      returnFormat="MM/DD/YYYY"
                      placeholder="dd/mm/yyyy"
                      label="Ngày kết thúc"
                      onChange={(e) => handleChange(e.value, "dateEnd")}
                      min={valueInput.dateStart}
                      error={err.dateEnd}
                      value={valueInput.dateEnd}
                      required
                      clearAble
                      className="dateTimePicker"
                    ></DatePicker>
                  </div>
                </div>
                <div
                  className="formAbout_calendar-item"
                  style={{ marginTop: 10 }}
                >
                  <div className="calendar_item-input">
                    <NumberInput
                      type="text"
                      label="Độ ưu tiên"
                      onChange={(e) =>
                        handleChange(parseInt(e.target.value), "priority")
                      }
                      placeholder="Nhập"
                      value={valueInput.priority}
                      error={err.priority}
                      min={0}
                    />
                  </div>
                </div>
              </div>
              <div className="formAbout_item">
                <Typography
                  // type="p1"
                  color="primary"
                  // style={{ fontSize: 16, marginRight: 10 }}
                  className="test"
                >
                  Cho phép nhân viên sửa trọng số
                </Typography>
                <Toggle
                  color="primary"
                  onChange={(e) => handleChange(e.value, "acpEditNumber")}
                  checked={valueInput?.acpEditNumber}
                ></Toggle>
              </div>
              <div className="formAbout_item">
                <Typography
                  type="p1"
                  color="primary"
                  style={{ fontSize: 16, marginRight: 10 }}
                >
                  Cho phép nhân viên hủy mục tiêu
                </Typography>
                <Toggle
                  color="primary"
                  onChange={(e) => handleChange(e.value, "acpCancelTarget")}
                  checked={valueInput?.acpCancelTarget}
                ></Toggle>
              </div>
              <Accordion expand>
                <AccordionSummary>
                  <Typography type="h4" color="info" uppercase={true}>
                    thông tin review
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="aboutReview1">
                    <div className="aboutReview1_left">
                      <Typography type="p1" color="primary">
                        Review mục tiêu
                      </Typography>
                      <Toggle
                        color="primary"
                        onChange={(e) => handleChange(e.value, "reviewTarget")}
                        checked={valueInput?.reviewTarget}
                      ></Toggle>
                    </div>
                    <div className="aboutReview1_right">
                      <div className="aboutReview1_right-bottom">
                        <DatePicker
                          displayFormat="DD/MM/YYYY"
                          returnFormat="MM/DD/YYYY"
                          placeholder="dd/mm/yyyy"
                          label="Hạn Review cuối"
                          onChange={(e) =>
                            handleChange(e.value, "dateReviewEnd")
                          }
                          value={valueInput?.dateReviewEnd}
                          clearAble
                          disabled={!openReviewTarget}
                        ></DatePicker>
                      </div>
                    </div>
                  </div>
                  <div className="aboutReview2">
                    <div className="aboutReview2_left">
                      <Dropdown
                        id="aboutReview2_left-dropdown"
                        dataSource={[
                          {
                            id: "1",
                          },
                          {
                            id: "2",
                          },
                          {
                            id: "3",
                          },
                        ]}
                        type={"number"}
                        label="Số cấp review"
                        viewType="outlined"
                        treeViewID="id"
                        treeViewParentID="parentID"
                        defaultValue="1"
                        onChange={(e) => handleChange(e.value, "numberReview")}
                        onKeyDown={(e) => {
                          const value =
                            e.key !== "Backspace" && _.toNumber(e.key);
                          if (_.isNaN(value)) {
                            e.returnValue = false;
                          }
                          if (e.code === "Space") {
                            e.returnValue = false;
                          }
                        }}
                        inputProps={{ readOnly: true }}
                        displayExpr="{id}"
                        disabled={!openReviewTarget}
                        value={valueInput?.numberReview}
                      />
                    </div>
                    <div className="aboutReview2_right">
                      <Typography type="p1" color="primary">
                        Cho phép sao chép kết quả của cấp trước
                      </Typography>
                      <Toggle
                        color="primary"
                        onChange={(e) =>
                          handleChange(e.value, "actCopyResults")
                        }
                        checked={valueInput?.actCopyResults}
                        disabled={!openReviewTarget}
                      ></Toggle>
                    </div>
                  </div>
                  {openReviewTarget && (
                    <div className="formAbout_body-item">
                      <div className="bodyAbout_item-bottom">
                        <TextInput
                          label="Label cấp 1"
                          type="text"
                          placeholder="Nhập"
                          onChange={(e) =>
                            handleChange(e.target.value, "inputLabel1")
                          }
                          value={valueInput?.inputLabel1}
                          disabled={!openReviewTarget}
                        />
                      </div>
                    </div>
                  )}

                  {openReviewTarget &&
                    (valueInput?.numberReview === "2" ||
                      valueInput?.numberReview === "3") && (
                      <div className="formAbout_body-item">
                        <div className="bodyAbout_item-bottom">
                          <TextInput
                            label="Label cấp 2"
                            type="text"
                            placeholder="Nhập"
                            onChange={(e) =>
                              handleChange(e.target.value, "inputLabel2")
                            }
                            value={valueInput?.inputLabel2}
                            disabled={
                              !openReviewTarget ||
                              valueInput?.numberReview === "1"
                            }
                          />
                        </div>
                      </div>
                    )}

                  {openReviewTarget && valueInput?.numberReview === "3" && (
                    <div className="formAbout_body-item">
                      <div className="bodyAbout_item-bottom">
                        <TextInput
                          label="Label cấp 2"
                          type="text"
                          placeholder="Nhập"
                          onChange={(e) =>
                            handleChange(e.target.value, "inputLabel3")
                          }
                          value={valueInput?.inputLabel3}
                          disabled={
                            !openReviewTarget ||
                            valueInput?.numberReview === "1" ||
                            valueInput?.numberReview === "2"
                          }
                        />
                      </div>
                    </div>
                  )}
                </AccordionDetails>
              </Accordion>
              <Accordion expand>
                <AccordionSummary>
                  <Typography type="h4" color="info" uppercase={true}>
                    thông tin xét duyệt
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="aboutXetDuyet">
                    <div className="aboutXetDuyet_left">
                      <Typography
                        type="p1"
                        color="primary"
                        style={{ fontSize: 16, marginRight: 10 }}
                      >
                        Review mục tiêu
                      </Typography>
                      <Toggle
                        color="primary"
                        onChange={(e) =>
                          handleChange(e.value, "approvalTarget")
                        }
                        checked={valueInput?.approvalTarget}
                      ></Toggle>
                    </div>
                    <div className="aboutXetDuyet_right">
                      <div className="aboutXetDuyet_right-bottom">
                        <DatePicker
                          displayFormat="DD/MM/YYYY"
                          returnFormat="MM/DD/YYYY"
                          placeholder="dd/mm/yyyy"
                          label="Ngày bắt đầu xét duyệt"
                          onChange={(e) =>
                            handleChange(e.value, "dateStartApproval")
                          }
                          value={valueInput?.dateStartApproval}
                          clearAble
                          disabled={!openApprovalTarget}
                        ></DatePicker>
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </ModalBody>
        <ModalFooter style={{ width: "100%", height: "8%" }}>
          <div className="backgroundAbout_form-bottom">
            <Button
              type="submit"
              color="info"
              text="LƯU"
              viewType="filled"
              startIcon="save"
              onClick={() => handleSubmit()}
            ></Button>
          </div>
        </ModalFooter>
      </Modal>
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
            size="small"
            text={valueNotification.text}
            vertical="bottom"
          />
        )}
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    addDataRequest: (
      valueInput,
      setShowLoading,
      setValueNotification,
      setShowLoadingNoti
    ) => {
      dispatch(
        actions.addData(
          valueInput,
          setShowLoading,
          setValueNotification,
          setShowLoadingNoti
        )
      );
    },
    updateData: (
      valueInput,
      id,
      setShowLoading,
      setValueNotification,
      setShowLoadingNoti
    ) => {
      dispatch(
        actions.updateData(
          valueInput,
          id,
          setShowLoading,
          setValueNotification,
          setShowLoadingNoti
        )
      );
    },
  };
};

export default connect(null, mapDispatchToProps)(AboutTable);
