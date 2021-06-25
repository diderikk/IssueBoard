# frozen_string_literal: true

require 'test_helper'

class IssueBoardTest < ActiveSupport::TestCase
  test 'should not save issue board without user or group' do
    issue_board = IssueBoard.new(name: "IssueBoard")
    assert_not issue_board.save, "Issue board not saved"
  end

  test "should not save issue board with both user and group" do

    issue_board = IssueBoard.new(name: "TestBoard", user_id: users(:one).id, group_id: groups(:group1).id)
    assert_not issue_board.save, "Issue board not saved"
  end

  test "should save issue board" do
    issue_board = IssueBoard.new(name: "Test", group_id: groups(:group1).id)
    assert issue_board.save, "Issue board saved"
  end

end
