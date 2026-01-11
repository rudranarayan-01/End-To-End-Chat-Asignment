import axios from 'axios';
import { io } from 'socket.io-client';

// This will use the Render URL once you have it, otherwise defaults to localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export const api = axios.create({
    baseURL: BASE_URL,
});

export const socket = io(BASE_URL);