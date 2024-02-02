import styled from "styled-components";

export const RightWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: ${(props) => props.theme.text.primaryColor};
  font-size: 14px;
  font-weight: 600;
  .btns {
    display: flex;
    color: ${(props) =>
      props.theme.$isAlpha ? "#fff" : props.theme.text.primaryColor};
    .btn {
      box-sizing: content-box;
      height: 18px;
      line-height: 18px;
      padding: 7px 12px;
      border-radius: 10px;
      cursor: pointer;
      &:hover {
        background-color: ${(props) =>
          props.theme.$isAlpha ? "rgba(255,255,255,.1)" : "#f5f5f5"};
      }
    }
  }
  .profile {
    box-sizing: border-box;
    position: relative;
    display: flex;
    /* 均匀排列每个元素 每个元素之间的间隔相等 */
    justify-content: space-evenly;
    align-items: center;

    width: 77px;
    height: 42px;
    margin-right: 24px;
    border: 1px solid #ccc;
    border-radius: 25px;
    background-color: #fff;
    color: ${(props) => props.theme.text.primaryColor};
    cursor: pointer;

    ${(props) => props.theme.mixin.boxShadow}
    .panel {
      position: absolute;
      top: 60px;
      right: 0;
      width: 240px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.18);
      .top,
      .bottom {
        padding: 10px 0;
        color: #666;
        .item {
          height: 40px;
          line-height: 40px;
          padding: 0 16px;
          &:hover {
            background-color: #f5f5f5;
          }
        }
      }
      .top {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        border-bottom: 1px solid #ddd;
        .item {
          box-sizing: border-box;
          width: 100%;
        }
      }
    }
  }
`;
