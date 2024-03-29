// client/src/components/ChatBot.js
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useAuthContext } from '../hooks/useAuthContext';
import HoldDetailsChat from './HoldDetailsChat';
import BookingDetailsChat from './BookingDetailsChat';
import ProductListChat from './ProductListChat';
import NLPProcessor from '../nlp/NLPProcessor';
import './ChatBot.css';
import { Link } from 'react-router-dom';

const ChatBot = ({ onSwitchToRealTime }) => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatWindowRef = useRef(null);
  // define irrelevant input count for bot response
  const [irrelevantInputCount, setIrrelevantInputCount] = useState(0);

  const handleFirstTimeGreeting = () => {
    setMessages([
      { text: 'Hello, how can I help you today?', sender: 'bot' },
      {
        text: 'Please select an option below or tell me how you need help:',
        sender: 'bot',
      },
      {
        text: 'For example, enter: Hold  Booking  Product  Discount...',
        sender: 'bot',
      },
    ]);
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') {
      return;
    }
    const message = {
      text: newMessage,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, message]);
    setIsProcessing(true);
    setNewMessage('');
    // Simulate a delay for processing
    setTimeout(async () => {
      await processUserMessage(message);
      setIsProcessing(false);
    }, 1000);
  };

  // process user message
  const processUserMessage = async (message) => {
    const nlpResult = NLPProcessor.processUserInput(message.text);
    if (messages.length === 0) {
      handleFirstTimeGreeting();
      return;
    }
    if (nlpResult.intent === 'default') {
      setIrrelevantInputCount((prevCount) => prevCount + 1);
    } else {
      // Reset the counter if the user input is relevant
      setIrrelevantInputCount(0);
    }

    // different intents will lead to different responses
    switch (nlpResult.intent) {
      case 'hello':
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Hello, how can I help you today?', sender: 'bot' },
        ]);
        break;
      case 'checkHold':
        const holdMessages = await fetchHoldData();
        if (holdMessages.length) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: holdMessages, sender: 'bot' },
            {
              text:
                'Here is your Hold list: (total ' + holdMessages.length + ')',
              sender: 'bot',
            },
            {
              text: (
                <Link to="/hold" className="btn btn-primary">
                  click here to go to Hold page
                </Link>
              ),
              sender: 'bot',
            },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: 'Sorry, I could not find any Hold information.',
              sender: 'bot',
            },
            {
              text: (
                <Link to="/Product" className="btn btn-primary">
                  go to Product page and then to hold
                </Link>
              ),
              sender: 'bot',
            },
          ]);
        }
        break;
      case 'howHold':
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: 'Want to know how to hold? You can find the Hold option on the website and view your hold list.',
            sender: 'bot',
          },
          {
            text: (
              <>
                <p>
                  First, you can enter 'show my hold list' to check whether you
                  already have a hold list. If not, you can click the link below
                  to the channel Product page and select the product you want to
                  hold.
                </p>
                <br />
                <Link to="/Product" className="btn btn-primary">
                  go to Product page and then to hold
                </Link>
              </>
            ),
            sender: 'bot',
          },
        ]);
        break;
      case 'howBooking':
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: 'Want to know how to booking? You can find the Booking option on the website and view your booking list.',
            sender: 'bot',
          },
          {
            text: (
              <>
                <p>
                  First, you can enter ‘show my booking list’ to check whether
                  you already have a booking list. If not, you can click the
                  link below to the channel Product page and select the product
                  you want to booking.
                </p>
                <br />
                <Link to="/Booking" className="btn btn-primary">
                  go to Booking page and then to booking
                </Link>
              </>
            ),
            sender: 'bot',
          },
        ]);
        break;
      case 'bookingList':
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: <BookingDetailsChat />,
            sender: 'bot',
          },
          {
            text: (
              <Link to="/Booking" className="btn btn-primary">
                go to Booking page and then to booking a new appointment
              </Link>
            ),
            sender: 'bot',
          },
        ]);
        break;
      case 'howProduct':
        setMessages((prevMessages) => [
          {
            text: 'Want to know how to get product? You can find the Product option on the website and view your product list.',
            sender: 'bot',
          },
          {
            text: (
              <>
                <p>
                  First, you can enter ‘show product list’ to check whether you
                  already have a product list. If not, you can click the link
                  below to the channel Product page and select the product you
                  want to get.
                </p>
                <br />
                <Link to="/Product" className="btn btn-primary">
                  go to Product page and then to get a new product
                </Link>
              </>
            ),
            sender: 'bot',
          },
        ]);
        break;
      case 'productList':
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: (
              <ProductListChat
                category={'all'}
                searchTerm={''}
                limitNumber={3}
              />
            ),
            sender: 'bot',
          },
          {
            text: 'this is the newest 3 products',
            sender: 'bot',
          },
          {
            text: (
              <Link to="/Product" className="btn btn-primary">
                go to Product page to find all products
              </Link>
            ),
            sender: 'bot',
          },
        ]);
        break;
      case 'listWhat':
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: 'what do you want? you can input "list/show hold", "list/show booking", "list/show product"',
            sender: 'bot',
          },
        ]);
        break;
      case 'discount':
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: (
              <a
                class="card h-100  "
                href="https://www.staples.ca/a/content/boxing-week-sale"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://images.ctfassets.net/2yd1b0rk61ek/6sLLnIT2Tl1vPrbnz7U4sF/b2165d09c8580dd8c96f6316b2e21ab0/DC-727-dropdownbanner-boxingdaydeals-en.png?fm=webp&q=80"
                  alt="Discount"
                  width={350}
                ></img>
              </a>
            ),
            sender: 'bot',
          },
          {
            text: (
              <div class="card h-100  ">
                <img
                  src="//images.ctfassets.net/2yd1b0rk61ek/3QHxUoKGvuvJbro9WEcq8L/c5297e55539d5b6f6b73ccab456f7a7a/DC-701-tile-boxingweek-laptops-en.jpg"
                  alt="Laptops"
                  width={350}
                ></img>
                <div class="card-body h-100 p-3">
                  <h3 class="card-title mt-2">Laptops</h3>
                  <p class="card-text mb-0  "></p>
                </div>

                <div class="card-footer px-3 bg-white border-0 ">
                  <a
                    href="https://www.staples.ca//collections/laptops-90?refinementList[named_tags.Sale][0]=1#algoliasearch-container"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            ),
            sender: 'bot',
          },
        ]);
        break;
      case 'delivery':
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: (
              <div
                className="tab-pane fade cat-2 active show"
                id="category-360001704992"
                role="tabpanel"
                aria-labelledby="#category-360001704992"
              >
                <h3 className="mt-0">Shipping &amp; Delivery</h3>
                <div className="section" id="section-360006954771">
                  <ul className="list-unstyled mb-4">
                    <li className="article mb-2">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://help.staples.ca/hc/en-us/articles/1500011073161-How-do-I-track-an-order-"
                      >
                        How do I track an order?
                      </a>
                    </li>

                    <li className="article mb-2">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://help.staples.ca/hc/en-us/articles/360026206871-Shipping-Delivery-Policy-"
                      >
                        Shipping &amp; Delivery Policy{' '}
                      </a>
                    </li>
                  </ul>
                </div>

                <h3 className="mt-0">Shipping &amp; Delivery FAQ</h3>
                <div className="section" id="section-1500001098821">
                  <ul className="list-unstyled mb-4">
                    <li className="article mb-2">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://help.staples.ca/hc/en-us/articles/360043605771-Why-are-some-items-missing-from-my-order-"
                      >
                        Why are some items missing from my order?
                      </a>
                    </li>

                    <li className="article mb-2">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://help.staples.ca/hc/en-us/articles/360041984812-What-are-your-delivery-times-"
                      >
                        What are your delivery times?
                      </a>
                    </li>

                    <li className="article mb-2">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://help.staples.ca/hc/en-us/articles/360043032932-Can-I-arrange-for-my-delivery-at-a-specific-time-"
                      >
                        Can I arrange for my delivery at a specific time?
                      </a>
                    </li>

                    <li className="article mb-2">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://help.staples.ca/hc/en-us/articles/360026206411-Can-I-have-an-order-shipped-to-the-store-rather-than-my-home-or-office-"
                      >
                        Can I have an order shipped to the store, rather than my
                        home or office?
                      </a>
                    </li>

                    <li className="article mb-2">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://help.staples.ca/hc/en-us/articles/360026206311-How-do-I-get-a-receipt-or-invoice-for-my-online-purchase-"
                      >
                        How do I get a receipt or invoice for my online
                        purchase?
                      </a>
                    </li>

                    <li className="article mb-2">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://help.staples.ca/hc/en-us/articles/360026206111-I-m-buying-furniture-Can-Staples-assemble-it-for-me-"
                      >
                        I'm buying furniture. Can Staples assemble it for me?
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            ),
            sender: 'bot',
          },
        ]);
        break;
      case 'payment':
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: (
              <div
                className="tab-pane fade cat-9 active show"
                id="category-360001704972"
                role="tabpanel"
                aria-labelledby="#category-360001704972"
              >
                <h3 className="mt-0">Eco Fees</h3>
                <div className="section" id="section-360004071731">
                  <ul className="list-unstyled mb-4">
                    <li className="article mb-2">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://help.staples.ca/hc/en-us/articles/360026193691-Why-am-I-being-charged-an-eco-fee-"
                      >
                        Why am I being charged an eco-fee?{' '}
                      </a>
                    </li>
                  </ul>
                </div>

                <h3 className="mt-0">Sales Tax</h3>
                <div className="section" id="section-360004064772">
                  <ul className="list-unstyled mb-4">
                    <li className="article mb-2">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://help.staples.ca/hc/en-us/articles/360025901212-How-do-I-apply-for-a-tax-exempt-account-"
                      >
                        How do I apply for a tax-exempt account?
                      </a>
                    </li>
                  </ul>
                </div>

                <h3 className="mt-0">Payment Options</h3>
                <div className="section" id="section-360004071711">
                  <ul className="list-unstyled mb-4">
                    <li className="article mb-2">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://help.staples.ca/hc/en-us/articles/360026193311-Can-I-get-a-discount-if-I-order-large-quantities-of-an-item-"
                      >
                        Can I get a discount if I order large quantities of an
                        item?{' '}
                      </a>
                    </li>

                    <li className="article mb-2">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://help.staples.ca/hc/en-us/articles/360025900812-Why-was-my-coupon-applied-to-multiple-items-or-the-wrong-item-"
                      >
                        Why was my coupon applied to multiple items or the wrong
                        item?{' '}
                      </a>
                    </li>

                    <li className="article mb-2">
                      <a
                        htarget="_blank"
                        rel="noopener noreferrer"
                        href="https://help.staples.ca/hc/en-us/articles/360026193171-What-methods-of-payment-does-Staples-accept-"
                      >
                        What methods of payment does Staples accept?{' '}
                      </a>
                    </li>
                  </ul>
                </div>

                <h3 className="mt-0">Payment History</h3>
                <div className="section" id="section-360004065012">
                  <ul className="list-unstyled mb-4">
                    <li className="article mb-2">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://help.staples.ca/hc/en-us/articles/360043026472-My-order-has-been-cancelled-but-I-still-have-a-charge-on-my-credit-card-"
                      >
                        My order has been cancelled, but I still have a charge
                        on my credit card?
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            ),
            sender: 'bot',
          },
        ]);
        break;
      case 'liveChat':
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: 'Do you need real time help?',
            sender: 'bot',
          },
          {
            text: (
              <button
                className="btn btn-primary"
                onClick={onSwitchToRealTime}
                style={{ marginLeft: '10px' }}
              >
                Yes, open real time chat
              </button>
            ),
            sender: 'bot',
          },
        ]);
        break;
      default:
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Sorry, I didn't understand what you meant, please provide more details and I will try my best to help you",
            sender: 'bot',
          },
        ]);
    }
  };

  const fetchHoldData = async () => {
    try {
      // request hold data
      const response = await fetch('/api/hold', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // check response
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // 处理响应数据，这里假设后端返回的数据格式是一个数组
      const holdList = await response.json();

      // 转换数据为 HoldDetails 组件
      const holdMessages = holdList.map((holdItem) => (
        <HoldDetailsChat hold={holdItem} />
      ));

      return holdMessages;
    } catch (error) {
      console.error('Error fetching hold data:', error);
      // 处理错误，可以根据实际情况返回默认数据或者做其他处理
      return [];
    }
  };

  useEffect(() => {
    handleFirstTimeGreeting();
  }, []);

  useEffect(() => {
    if (irrelevantInputCount >= 5) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: 'Do you need real time help?',
          sender: 'bot',
        },
        {
          text: (
            <button
              className="btn btn-primary"
              onClick={onSwitchToRealTime}
              style={{ marginLeft: '10px' }}
            >
              Yes, open real time chat
            </button>
          ),
          sender: 'bot',
        },
      ]);
    }
  }, [irrelevantInputCount, onSwitchToRealTime]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Container>
      <Row>
        <Col>
          <div className="chat-window" ref={chatWindowRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-bubble ${
                  message.sender === 'bot' ? 'bot' : 'user'
                }`}
              >
                {message.sender === 'bot' ? (
                  <i
                    className="fa-brands fa-bots"
                    style={{ marginRight: '5px', fontSize: '26px' }}
                  ></i>
                ) : (
                  <i
                    className="fa-solid fa-user"
                    style={{ marginRight: '5px' }}
                  ></i>
                )}
                {message.text}
              </div>
            ))}
            {isProcessing && (
              <div className="message-bubble bot">
                <Spinner animation="border" variant="primary" size="sm" />
                <span style={{ marginLeft: '10px' }}>
                  ChatBot is processing...
                </span>
              </div>
            )}
          </div>
        </Col>
      </Row>
      <div className="message-input">
        <Form onSubmit={handleMessageSubmit} style={{ width: '100%' }}>
          <Row>
            <Col>
              <Form.Control
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
            </Col>
            <Col>
              <Button variant="primary" type="submit">
                Send
              </Button>
              <span> Chat Bot Service</span>
            </Col>
          </Row>
        </Form>
      </div>
    </Container>
  );
};

export default ChatBot;
