import Grid3DModel from 'echarts-gl/lib/component/Grid3D/Grid3DModel';
import Grid3DView from 'echarts-gl/lib/component/Grid3D/Grid3DView';
import grid3DCreator from 'echarts-gl/lib/coord/grid3DCreator';
import Axis3DModel from 'echarts-gl/lib/component/Grid3D/Axis3DModel';
import createAxis3DModel from 'echarts-gl/lib/component/Grid3D/createAxis3DModel';

// scatter3D
import Scatter3DSeries from 'echarts-gl/lib/chart/scatter3D/Scatter3DSeries';
import Scatter3DView from 'echarts-gl/lib/chart/scatter3D/Scatter3DView';

function getAxisType(axisDim, option) {
    // Default axis with data is category axis
    return option.type || (option.data ? 'category' : 'value');
}

export function Grid3DComponent(registers) {
    registers.registerComponentModel(Grid3DModel);
    registers.registerComponentView(Grid3DView);
    registers.registerCoordinateSystem('grid3D', grid3DCreator);
    ['x', 'y', 'z'].forEach(function (dim) {
        createAxis3DModel(registers, dim, Axis3DModel, getAxisType, {
            name: dim.toUpperCase()
        });
        const AxisView = registers.ComponentView.extend({
            type: dim + 'Axis3D'
        });
        registers.registerComponentView(AxisView);
    });
    registers.registerAction({
        type: 'grid3DChangeCamera',
        event: 'grid3dcamerachanged',
        update: 'series:updateCamera'
    }, function (payload, ecModel) {
        ecModel.eachComponent({
            mainType: 'grid3D',
            query: payload
        }, function (componentModel) {
            componentModel.setView(payload);
        });
    });
    registers.registerAction({
        type: 'grid3DShowAxisPointer',
        event: 'grid3dshowaxispointer',
        update: 'grid3D:showAxisPointer'
    }, function (payload, ecModel) {
    });
    registers.registerAction({
        type: 'grid3DHideAxisPointer',
        event: 'grid3dhideaxispointer',
        update: 'grid3D:hideAxisPointer'
    }, function (payload, ecModel) {
    });
}


export function Scatter3DChart(registers) {
    registers.registerChartView(Scatter3DView);
    registers.registerSeriesModel(Scatter3DSeries);
    registers.registerLayout({
        seriesType: 'scatter3D',
        reset: function (seriesModel) {
            var coordSys = seriesModel.coordinateSystem;

            if (coordSys) {
                var coordDims = coordSys.dimensions;

                if (coordDims.length < 3) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.error('scatter3D needs 3D coordinateSystem');
                    }

                    return;
                }

                var dims = coordDims.map(function (coordDim) {
                    return seriesModel.coordDimToDataDim(coordDim)[0];
                });
                var item = [];
                var out = [];
                return {
                    progress: function (params, data) {
                        var points = new Float32Array((params.end - params.start) * 3);

                        for (var idx = params.start; idx < params.end; idx++) {
                            var idx3 = (idx - params.start) * 3;
                            item[0] = data.get(dims[0], idx);
                            item[1] = data.get(dims[1], idx);
                            item[2] = data.get(dims[2], idx);
                            coordSys.dataToPoint(item, out);
                            points[idx3] = out[0];
                            points[idx3 + 1] = out[1];
                            points[idx3 + 2] = out[2];
                        }

                        data.setLayout('points', points);
                    }
                };
            }
        }
    });
}