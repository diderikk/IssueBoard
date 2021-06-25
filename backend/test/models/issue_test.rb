# frozen_string_literal: true

require 'test_helper'

class IssueTest < ActiveSupport::TestCase
  test "should not save issue when wrong format due date" do
    issue = Issue.new(issue_id: 200, title: "Title", due_date: "2012-12-12", issue_label_id: issue_labels(:issue_label1).id)
    assert issue.save, "Issue not saved"
  end
end
