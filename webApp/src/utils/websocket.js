import Stomp from 'stompjs';
import { GET_ACTIVE_MQ_CONFIG } from '../constants/service';
import ajax from './ajax';
import { CONFIG } from '../configs';

let client = null;

/**
 * 有问题，需要调试
 */
const getWsUrl = () => {
    let result = async (dispatch) => {
        let websocketUrl = await ajax.get(GET_ACTIVE_MQ_CONFIG);
        return dispatch({
            websocketUrl: websocketUrl,
        });
    };
    return result;
};

const connect = (topicName, sucCallback) => {
    let websocketUrl = CONFIG.websocket.url;
    if (!websocketUrl) {
        websocketUrl = getWsUrl();
    }

    if (client == null) {
        client = Stomp.client(websocketUrl);
    }
    client.connect(
        CONFIG.websocket.user,
        CONFIG.websocket.password,
        () => {
            if (sucCallback) {
                console.log(CONFIG.websocket.connectMessage);
                client.heartbeat.outgoing = 2000; // client will send heartbeats every 20000ms
                client.heartbeat.incoming = 0; // client does not want to receive heartbeats from the server
                client.subscribe(`/topic/${topicName}`, sucCallback);
            }
        },
        () => {
            //尝试重连
            console.log(CONFIG.websocket.lostMessage);
            setTimeout(() => {
                client = null;
                connect(
                    topicName,
                    sucCallback
                );
            }, 1000);
        }
    );
    client.debug = (str) => (CONFIG.isDev ? str : false);
};

export default { connect };
