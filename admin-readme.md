# CTF Platform - Administrator Guide

This comprehensive guide covers all administrative features and capabilities of the Attack and Defense CTF Platform.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Admin Authentication](#admin-authentication)
3. [Dashboard Overview](#dashboard-overview)
4. [Team Management](#team-management)
5. [Flag Management](#flag-management)
6. [Configuration Management](#configuration-management)
7. [Passive Points System](#passive-points-system)
8. [Competition Initialization](#competition-initialization)
9. [Chat Moderation](#chat-moderation)
10. [Scoreboard Monitoring](#scoreboard-monitoring)
11. [Security Features](#security-features)
12. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Initial Setup

1. **Database Initialization**: Run the setup script to create the initial admin account
   \`\`\`bash
   npm run setup-db
   \`\`\`

2. **Default Credentials**:
   - Username: `admin`
   - Password: `admin`
   - **⚠️ Important**: Change these credentials immediately after first login

3. **Access Admin Panel**: Navigate to `/admin/login`

### Admin Panel Structure

The admin panel is organized into several key sections:
- **Dashboard**: Overview and quick actions
- **Teams**: Team management and monitoring
- **Flags**: Flag creation and management
- **Configuration**: Real-time system configuration
- **Passive Points**: Automated scoring system
- **Initialize**: Competition setup wizard
- **Chat**: Team communication monitoring
- **Scoreboard**: Real-time competition monitoring

---

## Admin Authentication

### Security Features

- **Secure Sessions**: JWT-based authentication with secure cookies
- **Password Hashing**: bcrypt encryption for password storage
- **Session Management**: Automatic logout and session validation
- **Route Protection**: Middleware-based access control

### Password Management

1. **Initial Login**: Use default credentials (admin/admin)
2. **Password Change**: Recommended immediately after first login
3. **Session Timeout**: Automatic logout for security
4. **Multiple Sessions**: Support for multiple admin sessions

### Access Control

- **Protected Routes**: All admin routes require authentication
- **API Security**: All admin APIs validate authentication
- **Middleware Protection**: Server-side route protection
- **Client-side Guards**: Frontend authentication checks

---

## Dashboard Overview

### Key Metrics Display

The admin dashboard provides real-time insights:

- **Active Teams**: Number of registered and active teams
- **Total Flags**: Count of all flags in the system
- **Submissions Today**: Daily flag submission statistics
- **System Status**: Passive points system status
- **Recent Activity**: Latest team activities and submissions

### Quick Actions

- **Start/Stop Passive Points**: Toggle automated scoring
- **View Live Scoreboard**: Real-time competition standings
- **Access Team Management**: Quick team overview
- **Configuration Access**: Direct link to system settings

### Real-time Updates

- **Live Data**: Dashboard updates automatically
- **Status Indicators**: Visual system health indicators
- **Activity Feed**: Recent competition activities
- **Performance Metrics**: System performance indicators

---

## Team Management

### Team Registration

#### Manual Team Creation
1. Navigate to **Teams** section
2. Click **"Add Team"**
3. Fill required information:
   - **Team Name**: Unique identifier
   - **Password**: Team login credentials
   - **Initial Score**: Starting points (default: 0)

#### Bulk Team Import
- **CSV Import**: Upload team lists via CSV
- **Batch Creation**: Create multiple teams simultaneously
- **Template Download**: Get CSV template for bulk import

### Team Monitoring

#### Team Information Display
- **Team ID**: Unique system identifier
- **Team Name**: Display name
- **Current Score**: Real-time point total
- **Last Activity**: Most recent team action
- **Flag Submissions**: Total submission count
- **Success Rate**: Percentage of successful submissions

#### Team Actions
- **Edit Team**: Modify team information
- **Reset Password**: Generate new team password
- **Adjust Score**: Manual score modifications
- **View History**: Detailed team activity log
- **Delete Team**: Remove team (with confirmation)

### Advanced Team Features

#### Score Management
- **Manual Adjustments**: Add/subtract points manually
- **Score History**: Track all score changes
- **Bulk Score Operations**: Apply changes to multiple teams
- **Score Validation**: Prevent negative scores (configurable)

#### Team Statistics
- **Submission Timeline**: Visual submission history
- **Performance Metrics**: Success rates and trends
- **Comparative Analysis**: Team performance comparison
- **Export Data**: Download team statistics

---

## Flag Management

### Flag Creation

#### Individual Flag Creation
1. Navigate to **Flags** section
2. Click **"Add Flag"**
3. Configure flag properties:
   - **Flag Value**: The actual flag string
   - **Points**: Points awarded for capture
   - **Team Assignment**: Which team owns this flag
   - **Category**: Flag classification (optional)
   - **Description**: Flag context or hints

#### Flag Properties
- **Unique Values**: System prevents duplicate flags
- **Point Values**: Configurable per flag
- **Team Ownership**: Each flag belongs to one team
- **Status Tracking**: Active/inactive flag states

### Flag Management Operations

#### Bulk Operations
- **Import Flags**: CSV-based flag import
- **Export Flags**: Download flag database
- **Bulk Edit**: Modify multiple flags simultaneously
- **Mass Assignment**: Assign flags to teams in bulk

#### Flag Monitoring
- **Submission Tracking**: See who submitted each flag
- **Capture Statistics**: Flag capture rates and timing
- **Popular Flags**: Most frequently attempted flags
- **Difficulty Analysis**: Success rate per flag

### Advanced Flag Features

#### Dynamic Flag Generation
- **Template System**: Create flag templates
- **Auto-generation**: Generate flags based on patterns
- **Randomization**: Random flag value generation
- **Validation Rules**: Ensure flag format compliance

#### Flag Categories
- **Web Exploitation**: Web-based challenges
- **Cryptography**: Encryption/decryption challenges
- **Forensics**: Digital forensics challenges
- **Reverse Engineering**: Binary analysis challenges
- **Custom Categories**: Define your own categories

---

## Configuration Management

### Real-time Configuration System

The configuration management system allows real-time changes without server restart.

#### Scoring Configuration

**Point Values**:
- **Self Flag Points** (default: 10): Points for submitting own team's flag
- **Attack Points** (default: 200): Points for capturing another team's flag
- **Defense Penalty** (default: 50): Points deducted when your flag is captured
- **Passive Points Value** (default: 1): Points awarded per flag during passive calculation

**Configuration Interface**:
- **Real-time Updates**: Changes apply immediately
- **Validation**: Input validation prevents invalid values
- **Preview Mode**: See changes before applying
- **Rollback**: Revert to previous configuration

#### Timing Configuration

**Intervals and Limits**:
- **Passive Points Interval**: Time between passive point awards (milliseconds)
- **Rate Limit Window**: Time window for rate limiting (milliseconds)
- **Max Submissions**: Maximum submissions per team per time window

**Advanced Timing**:
- **Custom Schedules**: Set specific times for passive points
- **Competition Duration**: Define competition start/end times
- **Maintenance Windows**: Schedule system maintenance

### Configuration Features

#### Change Management
- **Change History**: Track all configuration changes
- **Admin Attribution**: See who made each change
- **Timestamp Tracking**: When changes were made
- **Change Validation**: Prevent invalid configurations

#### Backup and Restore
- **Configuration Backup**: Save current settings
- **Restore Points**: Revert to previous configurations
- **Export Settings**: Download configuration files
- **Import Settings**: Upload configuration files

---

## Passive Points System

### System Overview

The passive points system automatically awards points to teams based on flag ownership at regular intervals.

#### How It Works
1. **Interval Trigger**: System runs at configured intervals
2. **Flag Ownership Check**: Determines which team owns each flag
3. **Point Calculation**: Awards points based on configuration
4. **Score Update**: Updates team scores automatically
5. **Logging**: Records all passive point awards

### Passive Points Management

#### System Control
- **Start/Stop**: Toggle passive points system
- **Status Monitoring**: Real-time system status
- **Next Run Time**: When the next calculation will occur
- **Manual Trigger**: Force immediate calculation

#### Scheduling Features
- **Start Time**: Set when passive points should begin
- **End Time**: Set when passive points should stop
- **Flexible Scheduling**: Optional time restrictions
- **Time Zone Support**: Proper time zone handling

### Advanced Passive Points Features

#### Calculation Rules
- **Flag Ownership**: Only teams that own flags receive points
- **Point Multipliers**: Configurable point values
- **Minimum Thresholds**: Minimum flags required for points
- **Maximum Limits**: Cap on passive points per interval

#### Monitoring and Logging
- **Calculation History**: Track all passive point awards
- **Team Breakdown**: See points awarded per team
- **Performance Metrics**: System performance monitoring
- **Error Handling**: Robust error recovery

---

## Competition Initialization

### Setup Wizard

The initialization system provides a streamlined way to set up competitions.

#### Initialization Steps
1. **Database Preparation**: Clear existing data (optional)
2. **Team Creation**: Bulk team setup
3. **Flag Generation**: Create competition flags
4. **Configuration**: Set competition parameters
5. **Validation**: Verify setup completion

### Competition Templates

#### Predefined Templates
- **Small Competition**: 5-10 teams, basic flags
- **Medium Competition**: 10-20 teams, moderate complexity
- **Large Competition**: 20+ teams, advanced features
- **Custom Setup**: Fully customizable configuration

#### Template Features
- **Team Auto-generation**: Create teams with patterns
- **Flag Distribution**: Automatic flag assignment
- **Score Presets**: Predefined scoring configurations
- **Time Settings**: Competition duration templates

### Advanced Initialization

#### Custom Competition Setup
- **Team Import**: Upload team lists
- **Flag Import**: Bulk flag creation
- **Custom Scoring**: Tailored point systems
- **Schedule Configuration**: Competition timing

#### Validation and Testing
- **Setup Validation**: Verify configuration completeness
- **Test Mode**: Run competition in test mode
- **Dry Run**: Simulate competition without affecting scores
- **Rollback**: Undo initialization if needed

---

## Chat Moderation

### Chat System Overview

The platform includes a team-based chat system with administrative oversight.

#### Chat Features
- **Team Channels**: Private team communication
- **Global Announcements**: Admin-to-all messaging
- **Real-time Updates**: Live message delivery
- **Message History**: Persistent chat logs

### Moderation Tools

#### Message Management
- **View All Messages**: Monitor all team communications
- **Message Search**: Find specific messages or keywords
- **Message Deletion**: Remove inappropriate content
- **User Warnings**: Send warnings to teams

#### Administrative Messaging
- **Global Announcements**: Broadcast to all teams
- **Team-specific Messages**: Direct team communication
- **System Notifications**: Automated system messages
- **Emergency Broadcasts**: Priority announcements

### Advanced Chat Features

#### Content Filtering
- **Keyword Filtering**: Automatic content filtering
- **Profanity Detection**: Block inappropriate language
- **Spam Prevention**: Rate limiting and spam detection
- **Custom Rules**: Define custom moderation rules

#### Chat Analytics
- **Message Statistics**: Chat activity metrics
- **Team Participation**: Communication patterns
- **Peak Activity**: Busiest chat periods
- **Export Logs**: Download chat history

---

## Scoreboard Monitoring

### Real-time Scoreboard

The admin scoreboard provides comprehensive competition monitoring.

#### Scoreboard Features
- **Live Updates**: Real-time score changes
- **Team Rankings**: Current standings
- **Score History**: Historical score progression
- **Submission Timeline**: Recent flag submissions

### Advanced Monitoring

#### Performance Analytics
- **Team Performance**: Individual team analysis
- **Flag Statistics**: Most/least captured flags
- **Submission Patterns**: Timing and frequency analysis
- **Competition Trends**: Overall competition progression

#### Export and Reporting
- **Score Export**: Download current standings
- **Historical Reports**: Generate competition reports
- **Custom Analytics**: Tailored performance metrics
- **Visual Charts**: Graphical score representation

### Monitoring Tools

#### Real-time Alerts
- **Score Milestones**: Alert on significant score changes
- **Unusual Activity**: Detect anomalous behavior
- **System Events**: Monitor system health
- **Competition Events**: Track important moments

#### Administrative Actions
- **Score Adjustments**: Manual score corrections
- **Team Actions**: Quick team management
- **Flag Operations**: Rapid flag modifications
- **System Controls**: Competition management tools

---

## Security Features

### Authentication Security

#### Password Security
- **bcrypt Hashing**: Secure password storage
- **Salt Generation**: Unique salts per password
- **Password Policies**: Configurable strength requirements
- **Brute Force Protection**: Login attempt limiting

#### Session Management
- **JWT Tokens**: Secure session tokens
- **Token Expiration**: Automatic session timeout
- **Secure Cookies**: HttpOnly and Secure flags
- **Session Validation**: Continuous authentication checks

### API Security

#### Rate Limiting
- **Request Limiting**: Prevent API abuse
- **IP-based Limiting**: Per-IP request limits
- **Team-based Limiting**: Per-team submission limits
- **Configurable Limits**: Adjustable rate limits

#### Input Validation
- **Data Sanitization**: Clean user inputs
- **Type Validation**: Ensure correct data types
- **Length Limits**: Prevent oversized inputs
- **SQL Injection Prevention**: Parameterized queries

### System Security

#### Database Security
- **Connection Security**: Encrypted database connections
- **Access Control**: Limited database permissions
- **Backup Security**: Encrypted backups
- **Audit Logging**: Database access logs

#### Application Security
- **HTTPS Enforcement**: Secure communication
- **CORS Configuration**: Cross-origin request control
- **Security Headers**: Protective HTTP headers
- **Error Handling**: Secure error responses

---

## Troubleshooting

### Common Issues

#### Authentication Problems
**Issue**: Cannot log in to admin panel
**Solutions**:
1. Verify credentials (default: admin/admin)
2. Check database connection
3. Clear browser cookies
4. Restart application

**Issue**: Session expires quickly
**Solutions**:
1. Check JWT configuration
2. Verify system time
3. Review session timeout settings

#### Database Issues
**Issue**: Database connection errors
**Solutions**:
1. Verify MongoDB is running
2. Check connection string
3. Verify database permissions
4. Review network connectivity

**Issue**: Data not persisting
**Solutions**:
1. Check database write permissions
2. Verify disk space
3. Review error logs
4. Restart database service

#### Performance Issues
**Issue**: Slow admin panel response
**Solutions**:
1. Check database indexes
2. Review query performance
3. Monitor system resources
4. Optimize database queries

**Issue**: High memory usage
**Solutions**:
1. Monitor active connections
2. Review memory leaks
3. Restart application
4. Optimize code performance

### Diagnostic Tools

#### Logging
- **Application Logs**: Detailed application logging
- **Error Logs**: Error tracking and reporting
- **Access Logs**: Request and response logging
- **Performance Logs**: Performance metrics

#### Monitoring
- **System Health**: Real-time system monitoring
- **Database Performance**: Database query monitoring
- **API Performance**: API response time tracking
- **Resource Usage**: CPU and memory monitoring

### Support and Maintenance

#### Regular Maintenance
- **Database Cleanup**: Remove old data
- **Log Rotation**: Manage log file sizes
- **Security Updates**: Apply security patches
- **Performance Optimization**: Regular performance tuning

#### Backup Procedures
- **Database Backups**: Regular database snapshots
- **Configuration Backups**: Save system settings
- **Code Backups**: Version control management
- **Recovery Procedures**: Disaster recovery plans

---

## Best Practices

### Competition Management
1. **Pre-competition Testing**: Test all systems before competition
2. **Backup Procedures**: Ensure reliable backups
3. **Monitoring Setup**: Configure comprehensive monitoring
4. **Emergency Procedures**: Prepare for system issues

### Security Best Practices
1. **Change Default Credentials**: Immediately after setup
2. **Regular Updates**: Keep system updated
3. **Access Control**: Limit admin access
4. **Audit Logging**: Enable comprehensive logging

### Performance Optimization
1. **Database Indexing**: Ensure proper indexes
2. **Caching**: Implement appropriate caching
3. **Resource Monitoring**: Monitor system resources
4. **Load Testing**: Test under competition load

---

## Advanced Features

### API Integration
- **REST APIs**: Full REST API support
- **Webhook Support**: External system integration
- **Custom Integrations**: Build custom tools
- **API Documentation**: Comprehensive API docs

### Customization
- **Theme Customization**: Custom UI themes
- **Branding**: Add organization branding
- **Custom Fields**: Additional data fields
- **Plugin System**: Extend functionality

### Scalability
- **Horizontal Scaling**: Multi-instance deployment
- **Load Balancing**: Distribute traffic
- **Database Clustering**: Scale database layer
- **Caching Layers**: Improve performance

---

## Support

For technical support or questions about the CTF Platform administration:

1. **Documentation**: Refer to this guide and the main README
2. **GitHub Issues**: Report bugs or request features
3. **Community**: Join the CTF community discussions
4. **Professional Support**: Contact for enterprise support

---

**Author**: [Alter-N0X](https://github.com/Alter-N0X)  
**Project**: Attack and Defense CTF Platform  
