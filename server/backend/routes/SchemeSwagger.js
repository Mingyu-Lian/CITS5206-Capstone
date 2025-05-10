/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required: [username, personName, email, passwordHash, role]
 *       properties:
 *         username: { type: string }
 *         personName: { type: string }
 *         email: { type: string }
 *         passwordHash: { type: string }
 *         role: { type: string, example: "admin" }
 *         discipline:
 *           type: array
 *           items: { type: string }
 *         isActive: { type: boolean }
 *
 *     LocoType:
 *       type: object
 *       required: [name]
 *       properties:
 *         name: { type: string }
 *         description: { type: string }
 *         isActive: { type: boolean }
 *
 *     Baseline:
 *       type: object
 *       required: [softwareName]
 *       properties:
 *         softwareName: { type: string }
 *         description: { type: string }
 *         isActive: { type: boolean }
 *         versions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               versionId: { type: string }
 *               version: { type: string }
 *               createdBy: { type: string }
 *               createdAt: { type: string }
 *               note: { type: string }
 *               isActive: { type: boolean }
 *               usageHistory:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     usedInLoco:
 *                       type: array
 *                       items: { type: number }
 *                     userId: { type: string }
 *                     usedAt: { type: string }
 *               updateHistory:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId: { type: string }
 *                     updatedAt: { type: string }
 *
 *     Asset:
 *       type: object
 *       required: [code, name, assetType, status]
 *       properties:
 *         code: { type: string }
 *         name: { type: string }
 *         description: { type: string }
 *         assetType: { type: string }
 *         locoID: { type: number }
 *         locoType: { type: string }
 *         status: { type: string }
 *         parentAsset: { type: string }
 *         isActive: { type: boolean }
 *
 *     Project:
 *       type: object
 *       required: [name, startDate]
 *       properties:
 *         name: { type: string }
 *         description: { type: string }
 *         startDate: { type: string }
 *         endDate: { type: string }
 *         createdBy: { type: string }
 *         createdAt: { type: string }
 *         updateHistory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId: { type: string }
 *               updatedAt: { type: string }
 *         isActive: { type: boolean }
 *
 *     Discipline:
 *       type: object
 *       required: [name]
 *       properties:
 *         name: { type: string }
 *         description: { type: string }
 *         client: { type: string }
 *         isActive: { type: boolean }
 *
 *     Log:
 *       type: object
 *       required: [userId, action, actionTime]
 *       properties:
 *         userId: { type: string }
 *         action: { type: string }
 *         locoID: { type: string }
 *         details: { type: string }
 *         actionTime: { type: string }
 *         recordTime: { type: string }
 *         ip: { type: string }
 *
 *     WorkTable:
 *       type: object
 *       properties:
 *         meta:
 *           type: object
 *           properties:
 *             type: { type: string }
 *             locoId: { type: string }
 *             projectId: { type: string }
 *             assignedSupervisor:
 *               type: array
 *               items: { type: string }
 *             assignedEngineer:
 *               type: array
 *               items: { type: string }
 *             createdAt: { type: string }
 *             createBy: { type: string }
 *             updateHistory:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId: { type: string }
 *                   updatedAt: { type: string }
 *             Version: { type: string }
 *             historyVersionTableId: { type: string }
 *             isActive: { type: boolean }
 *         Content:
 *           type: object
 *           properties:
 *             documentId: { type: string }
 *             projectId: { type: string }
 *             documentType: { type: string }
 *             documentNumber: { type: string }
 *             documentTitle: { type: string }
 *             documentStatus: { type: string }
 *             revision: { type: string }
 *             issueDate: { type: string }
 *             createdBy: { type: string }
 *             approvedBy: { type: string }
 *             sections:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sectionId: { type: string }
 *                   sectionTitle: { type: string }
 *                   content: { type: string }
 *                   attachments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         fileId: { type: string }
 *                         fileName: { type: string }
 *                         fileType: { type: string }
 *                         fileUrl: { type: string }
 *
 *     Task:
 *       type: object
 *       properties:
 *         meta:
 *           type: object
 *           properties:
 *             type: { type: string }
 *             locoId: { type: string }
 *             projectId: { type: string }
 *             assignedSupervisor:
 *               type: array
 *               items: { type: string }
 *             assignedEngineer:
 *               type: array
 *               items: { type: string }
 *             createdAt: { type: string }
 *             createBy: { type: string }
 *             updateHistory:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId: { type: string }
 *                   updatedAt: { type: string }
 *             Version: { type: string }
 *             historyVersionTaskId: { type: string }
 *             isActive: { type: boolean }
 *         Content:
 *           type: object
 *           properties:
 *             ImportantNotes: { type: string }
 *             Tasks:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ItemNumber: { type: string }
 *                   Title: { type: string }
 *                   TaskOverview: { type: string }
 *                   Authors:
 *                     type: array
 *                     items: { type: string }
 *                   VerifiedBy: { type: string }
 *                   ApprovedBy: { type: string }
 *                   AuthorizedBy: { type: string }
 *                   ReviewHistory:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         ReviewedBy: { type: string }
 *                         ReviewType: { type: string }
 *                         ReviewDate: { type: string }
 *                         Comments: { type: string }
 *                   Steps:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         ItemNumber: { type: string }
 *                         Title: { type: string }
 *                         Instructions: { type: string }
 *                         SubSteps:
 *                           type: array
 *                           items: { type: string }
 *                         KeyPoints:
 *                           type: array
 *                           items: { type: string }
 *                         Components: { type: string }
 *                         Location: { type: string }
 *                         Alerts: { type: string }
 *                         SupportingImages:
 *                           type: array
 *                           items: { type: string }
 *                         Discipline:
 *                           type: object
 *                           properties:
 *                             ID: { type: string }
 *                             Title: { type: string }
 *                         Comments:
 *                           type: array
 *                           items: { type: string }
 */