// import create from 'zustand';
//
//
// export const dataPageStore = create(set => ({
//     roiID: null,
//     roiMeta: [{"meta": ""}],
//     roiIDList: [],
//     roiMetaList: [],
//     recordData: null,
//     cellData: null,
//     bbox: {x1: 10, x2: 20, y1: 10, y2: 20},
//     bbox3d: {x1: 10, x2: 20, y1: 10, y2: 20, z1: 10, z2: 20},
//     is3d: false,
//
//     setRecordData: (data) => set(state => {
//         state.recordData = data;
//     }),
//     setRoiMeta: (data) => set(state => {
//         state.roiMeta = data;
//     }),
//     setCellData: (data) => set(state => {
//         state.cellData = data;
//     }),
//     setBBox: (data) => set(state => {
//         state.bbox = data;
//     }),
//     setBBox3d: (data) => set(state => {
//         state.bbox3d = data;
//     }),
//     setDataType: (data) => set(state => {
//         state.is3d = data;
//     }),
//
//     // state update function
//     updateROIList: (roiID, roiMeta) => set(state => {
//         let update = true;
//         state.roiID = roiID;
//         state.roiMeta = roiMeta;
//
//         update = state.roiIDList.includes(roiID)
//         state.roiIDList = update ? state.roiIDList : [...state.roiIDList, roiID]
//         state.roiMetaList = update ? state.roiMetaList : [...state.roiMetaList, roiMeta]
//     }),
//
//     setCurrentROI: (roiID, roiMeta) => set(state => {
//         state.roiID = roiID;
//         state.roiMeta = roiMeta;
//     }),
//
//     deleteROI: (roiID) => set(state => {
//
//         let newROIList = [];
//         let newROIMetaList = [];
//
//         for (let i = 0; i < state.roiIDList.length; i++) {
//             let ele = state.roiIDList[i];
//             if (ele !== roiID) {
//                 newROIList.push(state.roiIDList[i])
//                 newROIMetaList.push(state.roiMetaList[i])
//             }
//         }
//
//         state.roiIDList = newROIList;
//         state.roiMetaList = newROIMetaList;
//     })
// }))