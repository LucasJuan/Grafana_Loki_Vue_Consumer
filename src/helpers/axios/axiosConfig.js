import axios from 'axios';
import moment from 'moment';

const lokiAxios = axios.create();

const configureAxiosInterceptors = () => {
    lokiAxios.interceptors.request.use((config) => {
        config.metadata = { startTime: new Date() };
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    lokiAxios.interceptors.response.use(
        (response) => {
            const endTime = new Date();
            const requestTime = endTime - response.config.metadata.startTime;
            sendLogToLoki(`Request: ${response.config.url}, Status: ${response.status}, Response Time: ${requestTime}ms`, response.config.method.toUpperCase());
            return response;
        },
        (error) => {
            const endTime = new Date();
            const requestTime = endTime - error.config.metadata.startTime;
            sendLogToLoki(`Request: ${error.config.url}, Status: ${error.response?.status}, Response Time: ${requestTime}ms, Error: ${error.message}`, error.config.method.toUpperCase());
            return Promise.reject(error);
        }
    );
};

let isSendingLog = false;

const sendLogToLoki = async (logMessage, method) => {
    if (!isSendingLog) {
        isSendingLog = true;
        const lokiEndpoint = 'http://localhost:3457/loki/api/v1/push';

        const timestamp = moment().valueOf() * 1000000;

        const logEntry = {
            streams: [
                {
                    stream: {
                        level: 'info',
                        app: 'bees',
                    },
                    values: [
                        [
                            timestamp.toString(),
                            `${method}; ${logMessage}`,
                        ],
                    ],
                },
            ],
        };
        const header = {
            'Content-Type': 'application/json',
        };

        try {
            const response = await lokiAxios.post(lokiEndpoint, logEntry, header);
            console.log('success:', response);
        } catch (error) {
            console.error('error:', error);
        }

        isSendingLog = false;
    }
};

configureAxiosInterceptors();

export default lokiAxios;