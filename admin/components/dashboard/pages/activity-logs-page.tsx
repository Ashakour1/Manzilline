"use client"

import { useEffect, useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Activity,
  Search,
  Filter,
  X,
  RefreshCw,
  Calendar,
  User,
  Clock,
  Eye,
  Info,
  Globe,
  Monitor,
  FileText,
} from "lucide-react"
import { getMyActivities, getUserActivities, type Activity as ActivityType } from "@/services/activity.service"
import { useToast } from "@/components/ui/use-toast"
import { useAuthStore } from "@/store/authStore"
import { formatDistanceToNow } from "date-fns"

const ITEMS_PER_PAGE = 20

const ACTION_COLORS: Record<string, string> = {
  LOGIN: "bg-green-100 text-green-800",
  LOGOUT: "bg-gray-100 text-gray-800",
  CREATE_PROPERTY: "bg-blue-100 text-blue-800",
  UPDATE_PROPERTY: "bg-yellow-100 text-yellow-800",
  DELETE_PROPERTY: "bg-red-100 text-red-800",
  VIEW_PROPERTY: "bg-purple-100 text-purple-800",
  CREATE_USER: "bg-indigo-100 text-indigo-800",
  UPDATE_USER: "bg-amber-100 text-amber-800",
  DELETE_USER: "bg-rose-100 text-rose-800",
}

export function ActivityLogsPage() {
  const { toast } = useToast()
  const { user } = useAuthStore()
  const [activities, setActivities] = useState<ActivityType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const loadActivities = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const userId = selectedUserId || user.id
      const isAdmin = user.role?.toUpperCase() === "ADMIN" || user.role?.toUpperCase() === "SUPER_ADMIN"
      const response = selectedUserId && isAdmin
        ? await getUserActivities(userId, ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE, actionFilter !== "all" ? actionFilter : undefined)
        : await getMyActivities(ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE, actionFilter !== "all" ? actionFilter : undefined)

      setActivities(response.data.activities)
      setTotal(response.data.total)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load activity logs"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, actionFilter, selectedUserId, user])

  const filteredActivities = useMemo(() => {
    if (!searchTerm) return activities

    const searchLower = searchTerm.toLowerCase()
    return activities.filter(
      (activity) =>
        activity.action.toLowerCase().includes(searchLower) ||
        activity.description?.toLowerCase().includes(searchLower) ||
        activity.user?.name.toLowerCase().includes(searchLower) ||
        activity.user?.email.toLowerCase().includes(searchLower)
    )
  }, [activities, searchTerm])

  const uniqueActions = useMemo(() => {
    const actions = new Set(activities.map((a) => a.action))
    return Array.from(actions).sort()
  }, [activities])

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return dateString
    }
  }

  const parseMetadata = (metadata: string | null) => {
    if (!metadata) return null
    try {
      return JSON.parse(metadata)
    } catch {
      return null
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground">
            View and monitor user activity logs
          </p>
        </div>
        <Button onClick={loadActivities} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>
            Total activities: {total} | Showing {filteredActivities.length} of {activities.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {actionFilter !== "all" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActionFilter("all")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : error ? (
            <Empty>
              <Activity className="h-12 w-12 text-muted-foreground" />
              <EmptyHeader>Error loading activities</EmptyHeader>
              <EmptyDescription>{error}</EmptyDescription>
            </Empty>
          ) : filteredActivities.length === 0 ? (
            <Empty>
              <Activity className="h-12 w-12 text-muted-foreground" />
              <EmptyHeader>No activities found</EmptyHeader>
              <EmptyDescription>
                {searchTerm || actionFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No activity logs available"}
              </EmptyDescription>
            </Empty>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.map((activity) => {
                      const metadata = parseMetadata(activity.metadata)
                      const actionColorClass =
                        ACTION_COLORS[activity.action] ||
                        "bg-gray-100 text-gray-800"

                      return (
                        <TableRow key={activity.id}>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={actionColorClass}
                            >
                              {activity.action.replace(/_/g, " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="truncate">
                              {activity.description || "—"}
                            </div>
                            {metadata && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                {Object.keys(metadata).length > 0 && (
                                  <span className="truncate">
                                    {JSON.stringify(metadata).substring(0, 50)}
                                    {JSON.stringify(metadata).length > 50 && "..."}
                                  </span>
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">
                                  {activity.user?.name || "Unknown"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {activity.user?.email || "—"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div className="flex flex-col">
                                <span className="text-sm">
                                  {formatDate(activity.createdAt)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(activity.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-mono text-muted-foreground">
                              {activity.ipAddress || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedActivity(activity)
                                setIsDetailsDialogOpen(true)
                              }}
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage + 1} of {Math.ceil(total / ITEMS_PER_PAGE) || 1}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0 || isLoading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={
                      currentPage >= Math.ceil(total / ITEMS_PER_PAGE) - 1 ||
                      isLoading
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Activity Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Activity Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this activity log entry
            </DialogDescription>
          </DialogHeader>
          
          {selectedActivity && (
            <div className="space-y-4 py-4">
              {/* Action */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  Action
                </div>
                <Badge
                  variant="outline"
                  className={
                    ACTION_COLORS[selectedActivity.action] ||
                    "bg-gray-100 text-gray-800"
                  }
                >
                  {selectedActivity.action.replace(/_/g, " ")}
                </Badge>
              </div>

              <Separator />

              {/* Description */}
              {selectedActivity.description && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Description
                    </div>
                    <p className="text-sm">{selectedActivity.description}</p>
                  </div>
                  <Separator />
                </>
              )}

              {/* User Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" />
                  User Information
                </div>
                <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Name</div>
                    <div className="text-sm font-medium">
                      {selectedActivity.user?.name || "Unknown"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Email</div>
                    <div className="text-sm font-medium">
                      {selectedActivity.user?.email || "—"}
                    </div>
                  </div>
                  {selectedActivity.user?.role && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Role</div>
                      <div className="text-sm font-medium">
                        {selectedActivity.user.role}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">User ID</div>
                    <div className="text-sm font-mono text-muted-foreground">
                      {selectedActivity.userId}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timestamp */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Timestamp
                </div>
                <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Relative Time</div>
                    <div className="text-sm font-medium">
                      {formatDate(selectedActivity.createdAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Exact Time</div>
                    <div className="text-sm font-medium">
                      {new Date(selectedActivity.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground mb-1">ISO Format</div>
                    <div className="text-xs font-mono text-muted-foreground">
                      {selectedActivity.createdAt}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* IP Address & User Agent */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  Network Information
                </div>
                <div className="grid grid-cols-1 gap-4 p-3 bg-muted rounded-lg">
                  {selectedActivity.ipAddress && (
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Globe className="h-3 w-3" />
                        IP Address
                      </div>
                      <div className="text-sm font-mono font-medium">
                        {selectedActivity.ipAddress}
                      </div>
                    </div>
                  )}
                  {selectedActivity.userAgent && (
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Monitor className="h-3 w-3" />
                        User Agent
                      </div>
                      <div className="text-xs font-mono text-muted-foreground break-all">
                        {selectedActivity.userAgent}
                      </div>
                    </div>
                  )}
                  {!selectedActivity.ipAddress && !selectedActivity.userAgent && (
                    <div className="text-sm text-muted-foreground">No network information available</div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              {parseMetadata(selectedActivity.metadata) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Metadata
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <pre className="text-xs overflow-auto max-h-60 whitespace-pre-wrap break-words">
                        {JSON.stringify(parseMetadata(selectedActivity.metadata), null, 2)}
                      </pre>
                    </div>
                  </div>
                </>
              )}

              {/* Activity ID */}
              <Separator />
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Activity ID</div>
                <div className="text-xs font-mono text-muted-foreground break-all">
                  {selectedActivity.id}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
