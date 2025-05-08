
import styles from './sidebar.module.css';
import { TrendingUp, Shield } from 'lucide-react';
import {Link} from "react-router-dom";
import logo from '../../assets/club.png'

const RedditSidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.communityInfo}>
                <div className={styles.banner}></div>
                <div className={styles.communityHeader}>
                    <img
                        src={logo}
                        alt="Community icon"
                        className={styles.communityIcon}
                    />
                    <h2 className={styles.communityName}>community</h2>
                </div>
                <p className={styles.communityDescription}>
                    Welcome to our community! This is a place to discuss topics related to our shared interests.
                </p>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>122</span>
                        <span className={styles.statLabel}>Members</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>37</span>
                        <span className={styles.statLabel}>Online</span>
                    </div>
                </div>
                <button className={styles.joinButton}>Join</button>
                <button className={styles.createPostButton}>Create Post</button>
            </div>

            <div className={styles.card}>
                <h3>Feeds</h3>
                <ul>
                    <li>
                        <Link to="/feeds" className={styles.navLink}>All</Link>
                    </li>
                    <li>
                        <Link to="/articles" className={styles.navLink}>Articles</Link>
                    </li>
                    <li>
                        <Link to="/homes/all" className={styles.navLink}>Testimonials</Link>
                    </li>
                </ul>
            </div>

            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Anonymous Options</h3>
                <div className={styles.option}>
                    <span>Anonymous mode</span>
                    <label className={styles.switch}>
                        <input type="checkbox" />
                        <span className={styles.slider}></span>
                    </label>
                </div>
            </div>


            <div className={styles.card}>
                <h3>Counsellors</h3>
                <ul>
                    <li>
                        <Link to="/counsellors/main" className={styles.navLink}>Main Counsellors</Link>
                    </li>
                    <li>
                        <Link to="/counsellors/peer" className={styles.navLink}>Peer Counsellors</Link>
                    </li>
                    <li>
                        <Link to="/counsellors/join" className={styles.navLink}>Join us</Link>
                    </li>
                    <li>
                        <Link to="/map" className={styles.navLink}>Map</Link>
                    </li>

                </ul>
            </div>


            <div className={styles.card}>
                <h3>Chat with</h3>
                <ul>
                    <li>
                        <Link to="/chat/community" className={styles.navLink}>Community</Link>
                    </li>
                    <li>
                        <Link to="/chat/group" className={styles.navLink}>Peer Groups</Link>
                    </li>
                    <li>
                        <Link to="/chat/peer" className={styles.navLink}>My Chats</Link> {/* some student with common challanges*/}
                    </li>
                    <li>
                        <Link to="/chat/peer" className={styles.navLink}>Find Peer</Link> {/* some student with common challanges*/}
                    </li>

                </ul>
            </div>

            <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                    <TrendingUp size={16} className={styles.cardIcon} />
                    Popular Topics
                </h3>
                <ul className={styles.topicsList}>
                    <li className={styles.topic}>Conflict resolution</li>
                    <li className={styles.topic}>Anxiety</li>
                    <li className={styles.topic}>Family dynamics</li>
                    <li className={styles.topic}>Emotional intelligence</li>
                    <li className={styles.topic}>Domestic abuse</li>
                </ul>
            </div>


            <div className={styles.card}>
                <h3>Account</h3>
                <ul>
                    <li>
                        <Link to="/profile" className={styles.navLink}>Profile</Link>
                    </li>
                    <li>
                        <Link to="/settings" className={styles.navLink}>Settings</Link>
                    </li>
                    <li>
                        <Link to="/login" className={styles.navLink}>Login/out</Link>
                    </li>
                </ul>
            </div>

            <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                    <Shield size={16} className={styles.cardIcon} />
                    Community Rules
                </h3>
                <ol className={styles.rulesList}>
                    <li className={styles.rule}>Be respectful to others</li>
                    <li className={styles.rule}>No spam or self-promotion</li>
                    <li className={styles.rule}>Use appropriate tags for content</li>
                    <li className={styles.rule}>Follow karatina university's content policy</li>
                    <li className={styles.rule}>Do not expose another users personal information</li>
                </ol>
            </div>

            <div className={styles.footer}>
                <div className={styles.footerLinks}>
                    <a href="#" className={styles.footerLink}>Help</a>
                    <a href="#" className={styles.footerLink}>About</a>
                    <a href="#" className={styles.footerLink}>Support</a>
                </div>
                <div className={styles.copyright}>
                    © 2025 Trachora, Inc. All rights reserved
                </div>
            </div>
        </aside>
    );
};

export default RedditSidebar;