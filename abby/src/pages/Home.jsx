import React, { useState, useRef, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { analyzeData } from '../services/api';
import "./Home.css";

function Home() {
    const [userQuery, setUserQuery] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatDisplayRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userQuery.trim()) return;

        const newUserMessage = {
            text: userQuery,
            type: 'user'
        };

        setMessages(prevMessages => [...prevMessages, newUserMessage]);
        setUserQuery("");
        setIsLoading(true);

        try {
            const result = await analyzeData(userQuery);
            
            const abbyMessage = {
                text: result.analysis,
                type: 'abby',
                data: result.data,
                chartType: result.data.length > 0 ? 'line' : null
            };

            setMessages(prevMessages => [...prevMessages, abbyMessage]);
        } catch (error) {
            console.error("Error:", error);
            const errorMessage = {
                text: error.response?.data?.detail || "系統異常，請稍後再試。",
                type: 'abby'
            };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (chatDisplayRef.current) {
            chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
        }
    }, [messages]);

    const renderChart = (data) => {
        return (
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <XAxis dataKey="client_id" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                        type="monotone" 
                        dataKey="total_amount" 
                        stroke="#8884d8" 
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        );
    };

    return (
        <motion.div 
            className="home-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="chat-window">
                <div className="chat-header">
                    <div className="status-indicator"></div>
                    <div className="app-name">Abby 智能分析</div>
                </div>
                <div className="chat-display" ref={chatDisplayRef}>
                    {messages.map((msg, index) => (
                        <motion.div 
                            key={index} 
                            className={`message ${msg.type}-message`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="message-text">{msg.text}</div>
                            {msg.data && msg.data.length > 0 && (
                                <>
                                    {renderChart(msg.data)}
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>客戶 ID</th>
                                                <th>總消費金額</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {msg.data.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{item.client_id}</td>
                                                    <td>{item.total_amount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div 
                            className="message abby-message loading"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ 
                                duration: 1.5, 
                                repeat: Infinity 
                            }}
                        >
                            分析中...
                        </motion.div>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="chat-input">
                    <input
                        type="text"
                        placeholder="輸入您的問題..."
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? '處理中' : '送出'}
                    </button>
                </form>
            </div>
        </motion.div>
    );
}

export default Home;