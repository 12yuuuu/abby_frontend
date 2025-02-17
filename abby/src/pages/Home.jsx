import React, { useState, useRef, useEffect } from "react";
import { Chart } from '@antv/g2';
import { motion } from 'framer-motion';
import Draggable from 'react-draggable';
import { Auto } from '@antv/g2-extension-ava';
import { analyzeData } from '../services/api';
import ReactMarkdown from 'react-markdown';
import './Home.css';

// 科技背景动画组件
const TechBackground = () => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
      const generateLines = () => {
          const lineCount = 20;
          const newLines = Array.from({ length: lineCount }, (_, index) => ({
              id: index,
              x1: Math.random() * 100,
              y1: Math.random() * 100,
              x2: Math.random() * 100,
              y2: Math.random() * 100,
              color: `hsl(${Math.random() * 360}, 70%, 50%)`,
              duration: Math.random() * 10 + 5
          }));
          setLines(newLines);
      };

      generateLines();
      const interval = setInterval(generateLines, 5000);
      return () => clearInterval(interval);
  }, []);

  return (
      <svg className="tech-background" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1}}>
          {lines.map(line => (
              <motion.line
                  key={line.id}
                  x1={`${line.x1}%`}
                  y1={`${line.y1}%`}
                  x2={`${line.x2}%`}
                  y2={`${line.y2}%`}
                  stroke={line.color}
                  strokeWidth="1"
                  strokeOpacity="0.5"
                  animate={{
                      x1: [line.x1, line.x2, line.x1],
                      y1: [line.y1, line.y2, line.y1],
                      strokeOpacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{
                      duration: line.duration,
                      repeat: Infinity,
                      ease: "easeInOut"
                  }}
              />
          ))}
      </svg>
  );
};

// 说明侧边栏组件
const SideBar = ({ side }) => {
  const content = {
      left: {
          title: "数据可视化助手",
          description: [
              "• 轻松转换销售数据为直观图表",
              "• 支持长条图、饼图、折线图、散点图",
              "• 实时分析，快速洞察业务趋势",
              "• 交互式界面，操作简单直观"
          ]
      },
      right: {
          title: "功能特点",
          description: [
              "• 智能图表生成",
              "• 多维度数据展示",
              "• 响应式设计",
              "• 科技感交互体验"
          ]
      }
  };

  return (
      <div className={`sidebar ${side}-sidebar`}>
          <h3>{content[side].title}</h3>
          {content[side].description.map((item, index) => (
              <p key={index}>{item}</p>
          ))}
      </div>
  );
};

function Home() {
    const [userQuery, setUserQuery] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [analysisText, setAnalysisText] = useState("");
    const chatDisplayRef = useRef(null);
    const chartRef = useRef(null);

    const renderBarChart = (data) => {
        if (chartRef.current) {
            chartRef.current.innerHTML = ''; // 清空之前的图表
            const chart = new Chart({
                container: chartRef.current,
                width: 600,
                height: 250,
                autoFit: true
            });

            chart
                .interval()
                .data(data)
                .encode('x', 'client_id')
                .encode('y', 'total_amount')
                .style('fillOpacity', 0.5)
                .style('fill', '#0c255d')
                .axis('x', { title: '客户ID' })
                .axis('y', { title: '总金额' });
            
            chart.render();
        }
    };

    const renderPieChart = (data) => {
        if (chartRef.current) {
            chartRef.current.innerHTML = ''; // 清空之前的圖表
            const chart = new Chart({
                container: chartRef.current,
                height: 400,
                width: 600,
                autoFit: true
            });
    
            // 使用 total_amount 作為主要數值
            const processedData = data.map(item => ({
                name: item.payment_method,
                value: parseFloat(item.total_amount),
                count: parseInt(item.transaction_count),
                percentage: parseFloat(item.percentage)
            }));
    
            chart.coordinate({ type: 'theta' });
    
            chart
                .interval()
                .transform({ type: 'stackY' })
                .data(processedData)
                .encode('y', 'value')
                .encode('color', 'name')
                .style('stroke', 'white')
                .scale('color', {
                    palette: [
                        '#4299E1', '#2B6CB0', '#2C5282', '#2A4365',
                        '#63B3ED', '#3182CE', '#2B6CB0', '#2C5282'
                    ]
                })
                .label({
                    text: (d) => `${d.name}\n${d.percentage}%\n$${d.value.toLocaleString()}`,
                    style: {
                        fontWeight: 'bold',
                        fill: '#fff',
                        fontSize: 12
                    }
                })
                .tooltip({
                    title: '付款方式分析',
                    items: [
                        { field: 'name', alias: '付款方式' },
                        { 
                            field: 'value', 
                            alias: '總金額',
                            transform: (val) => `$${val.toLocaleString()}`
                        },
                        { 
                            field: 'count', 
                            alias: '交易次數'
                        },
                        { 
                            field: 'percentage', 
                            alias: '占比',
                            transform: (val) => `${val}%`
                        }
                    ]
                });
    
            chart.render();
        }
    };

    const renderLineChart = (data) => {
        if (chartRef.current) {
            chartRef.current.innerHTML = ''; // 清空之前的图表
            const chart = new Chart({
                container: chartRef.current,
                width: 600,
                height: 250,
                autoFit: true
            });

            chart
                .line()
                .data(data)
                .encode('x', 'month')              // 修改為 month
                .encode('y', 'total_monthly_amount') // 修改為 total_monthly_amount
                .style('stroke', '#437da5')
                .style('lineWidth', 2)
                .axis('x', { title: '月份' })         // 可以修改為更符合趨勢圖的標題
                .axis('y', { title: '总消费金额' });  // 修改為總消費金額
            
            chart.render();
        }
    };

    const renderScatterPlot = (data) => {
        if (chartRef.current) {
            chartRef.current.innerHTML = ''; // Clear previous chart
    
            const chart = new Chart({
                container: chartRef.current,
                width: 600,
                height: 400,
                autoFit: true
            });
    
            // Process the data: x axis is sku_id, y axis is total_quantity, and client_id will be used for color
            const processedData = data.map(item => ({
                x: item.sku_id,
                y: item.total_quantity,
                client: item.client_id  // Use client_id for color differentiation
            }));
    
            chart
                .point()  // Changed from mark(Auto) to .point() for scatter plot
                .data(processedData)
                .encode('x', 'x')           // x axis: sku_id
                .encode('y', 'y')           // y axis: total_quantity
                .encode('color', 'client')  // Color by client_id
                .axis('x', { 
                    title: '产品ID',
                    label: {
                        style: {
                            fill: '#fff'
                        }
                    }
                })
                .axis('y', { 
                    title: '消费数量',
                    label: {
                        style: {
                            fill: '#fff'
                        }
                    }
                })
                .tooltip({
                    title: '客户消费分布',
                    items: [
                        { field: 'x', alias: '产品ID' },
                        { field: 'y', alias: '消费数量' },
                        { field: 'client', alias: '客户ID' }
                    ]
                });
    
            chart.render();
        }
    };         

    const renderChart = (data, chartType) => {
        switch(chartType) {
            case 'barChart':
                renderBarChart(data);
                break;
            case 'pieChart':
                renderPieChart(data);
                break;
            case 'lineChart':
                renderLineChart(data);
                break;
            case 'scatterPlot':
                renderScatterPlot(data);
                break;
            default:
                renderBarChart(data);
        }
    };

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
        setAnalysisText("");
    
        try {
            console.log('Sending query:', userQuery.trim());
            
            const queryMap = {
                '我想比較所有客户的消费总金额': 'barChart',
                '我想知道各个客户的付款方式占比': 'pieChart',
                '我想了解各个月的消费金额趋势': 'lineChart',
                '我想比较不同用户在不同产品之间的消费数量': 'scatterPlot'
            };
    
            const chartType = queryMap[userQuery.trim()] || 'barChart';
    
            const response = await analyzeData(userQuery.trim());
            console.log('Received response:', response);
    
            if (response && response.analysis && response.data) {
                const responseMessage = {
                    type: 'abby',
                    text: response.analysis,
                    data: response.data,
                    chartType: chartType
                };
    
                setMessages(prevMessages => [...prevMessages, responseMessage]);
                setAnalysisText(response.analysis);
    
                if (response.data.length > 0) {
                    console.log('Rendering chart with data:', response.data);
                    renderChart(response.data, chartType);
                }
            } else {
                throw new Error('無效的回應格式');
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            
            const errorMessage = {
                type: 'abby',
                text: `錯誤：${error.message}`,
                errorDetails: error.details ? (
                    <div className="error-details">
                        <p className="error-title">詳細錯誤信息：</p>
                        <pre className="error-content">{error.details}</pre>
                    </div>
                ) : null
            };
            
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.data && lastMessage.chartType) {
            console.log('Rendering chart with data:', lastMessage.data);
            renderChart(lastMessage.data, lastMessage.chartType);
        }
    }, [messages]);

    useEffect(() => {
        if (chatDisplayRef.current) {
            chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
        }
    }, [messages]);

    const handleDrag = (e, data) => {
        setPosition({ x: data.x, y: data.y });
    };

    const renderMessage = (msg, index) => {
        return (
            <motion.div 
                key={index} 
                className={`message ${msg.type}-message`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="message-content">
                    {msg.type === 'user' ? (
                        <div className="message-text">{msg.text}</div>
                    ) : (
                        <div className="message-text markdown-content">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                            {msg.errorDetails && (
                                <div className="error-details">
                                    <p className="error-title">error：</p>
                                    <pre className="error-content">{msg.errorDetails}</pre>
                                </div>
                            )}
                        </div>
                    )}
                    {msg.data && msg.data.length > 0 && msg.chartType && (
                        <div ref={chartRef} className="chart-container"></div>
                    )}
                </div>
            </motion.div>
        );
    };

    return (
      <div className="app-container">
          <TechBackground />
          <SideBar side="left" />
          <Draggable 
              handle=".chat-header"
              defaultPosition={{x: 0, y: 0}}
              position={position}
              onDrag={handleDrag}
          >
              <motion.div 
                  className="home-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
              >
                  <div className="chat-window">
                      <div className="chat-header">
                          <div className="status-indicator"></div>
                          <div className="app-name">Abby 分析助手</div>
                      </div>
                      <div className="chat-display" ref={chatDisplayRef}>
                          {messages.map((msg, index) => renderMessage(msg, index))}
                          {isLoading && (
                              <motion.div 
                                  className="message abby-message loading"
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                  分析中...
                              </motion.div>
                          )}
                      </div>
                      <form onSubmit={handleSubmit} className="chat-input">
                          <input
                              type="text"
                              placeholder="输入你的问题"
                              value={userQuery}
                              onChange={(e) => setUserQuery(e.target.value)}
                          />
                          <button type="submit" disabled={isLoading}>
                              {isLoading ? '处理中' : '发送'}
                          </button>
                      </form>
                  </div>
              </motion.div>
          </Draggable>
          <SideBar side="right" />
      </div>
  );
}

export default Home;